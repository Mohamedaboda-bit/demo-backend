import { Injectable } from '@nestjs/common';
import { ShopifyConfigService } from '../config/shopify.config';
import { ShopifyOrdersResponse } from '../interfaces/shopify.interfaces';
import { calculateOrderAnalytics } from '../utils/analytics.helper';

const PAGE_SIZE = 250;
const REQUEST_DELAY_MS = 1000;

@Injectable()
export class ShopifyOrdersService {
  constructor(private readonly shopifyConfig: ShopifyConfigService) {}

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllOrders(startDate?: string | null, endDate?: string | null): Promise<ShopifyOrdersResponse> {
    const client = this.shopifyConfig.getGraphqlClient();
    console.log('getAllOrders', startDate, endDate);
    let orders: Array<{
      id: string | number;
      name: string;
      customer_id: string | number | null;
      customer_name: string | null;
      createdAt: string;
      displayFinancialStatus: string | null;
      totalPrice: number;
      subtotal: number;
      totalDiscounts: number;
      totalTax: number;
      totalShipping: number;
      totalRefunded: number;
      paymentGatewayNames: string[];
      displayFulfillmentStatus: string | null;
      lineItemsCount: number;
      tags: string[];
      currency: string;
      moments_count?: number;
    }> = [];

    let hasNextPage = true;
    let cursor: string | null = null;
    let retryCount = 0;

    let dateQuery = '';
    if (startDate && endDate) dateQuery = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;
    else if (startDate) dateQuery = `created_at:>='${startDate}'`;
    else if (endDate) dateQuery = `created_at:<='${endDate}'`;

    while (hasNextPage && retryCount < 5) {
      try {
        const query = `
          query getOrders($first: Int!, $after: String, $query: String) {
            orders(first: $first, after: $after, query: $query) {
              edges {
                node {
                  id
                  legacyResourceId
                  name
                  createdAt
                  displayFinancialStatus
                  displayFulfillmentStatus
                  totalPriceSet { shopMoney { amount currencyCode } }
                  subtotalPriceSet { shopMoney { amount currencyCode } }
                  totalDiscountsSet { shopMoney { amount currencyCode } }
                  totalTaxSet { shopMoney { amount currencyCode } }
                  totalShippingPriceSet { shopMoney { amount currencyCode } }
                  totalRefundedSet { shopMoney { amount currencyCode } }
                  paymentGatewayNames
                  tags
                  lineItems(first: 250) { edges { node { id } } }
                  customer { id legacyResourceId displayName }
                  customerJourneySummary { momentsCount { count } }
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        `;

        const variables: any = { first: PAGE_SIZE, after: cursor, query: dateQuery || null };
        const response: any = await client.request(query, { variables });
        const edges = response.data?.orders?.edges || [];
        const pageInfo = response.data?.orders?.pageInfo || { hasNextPage: false, endCursor: null };

        const transformed = edges.map((edge: any) => {
          const node = edge.node;
          return {
            id: node.legacyResourceId,
            name: node.name,
            customer_id: node.customer?.legacyResourceId ?? null,
            customer_name: node.customer?.displayName ?? null,
            createdAt: node.createdAt,
            displayFinancialStatus: node.displayFinancialStatus ?? null,
            totalPrice: parseFloat(node.totalPriceSet?.shopMoney?.amount) || 0,
            subtotal: parseFloat(node.subtotalPriceSet?.shopMoney?.amount) || 0,
            totalDiscounts: parseFloat(node.totalDiscountsSet?.shopMoney?.amount) || 0,
            totalTax: parseFloat(node.totalTaxSet?.shopMoney?.amount) || 0,
            totalShipping: parseFloat(node.totalShippingPriceSet?.shopMoney?.amount) || 0,
            totalRefunded: parseFloat(node.totalRefundedSet?.shopMoney?.amount) || 0,
            paymentGatewayNames: node.paymentGatewayNames || [],
            displayFulfillmentStatus: node.displayFulfillmentStatus ?? null,
            lineItemsCount: (node.lineItems?.edges?.length || 0),
            tags: node.tags || [],
            currency: node.totalPriceSet?.shopMoney?.currencyCode || 'USD',
            moments_count: node.customerJourneySummary?.momentsCount?.count || 0,
          };
        });

        orders = orders.concat(transformed);
        hasNextPage = !!pageInfo.hasNextPage;
        cursor = pageInfo.endCursor;
        retryCount = 0;
        if (hasNextPage) await this.sleep(REQUEST_DELAY_MS);
      } catch (err: any) {
        retryCount += 1;
        if (retryCount >= 5) throw err;
        await this.sleep(REQUEST_DELAY_MS * retryCount);
      }
    }

    const cleanOrders = orders.map((o) => ({
      order_id: o.id ?? '-',
      order_name: o.name ?? '-',
      customer_id: o.customer_id ?? '-',
      customer_name: o.customer_name ?? '-',
      order_date_time: o.createdAt ?? '-',
      order_status: o.displayFinancialStatus ?? '-',
      total_order_value: o.totalPrice.toFixed(2),
      subtotal: o.subtotal.toFixed(2),
      total_discounts_applied: o.totalDiscounts.toFixed(2),
      taxes_collected: o.totalTax.toFixed(2),
      shipping_fee_charged: o.totalShipping.toFixed(2),
      refund_amount: o.totalRefunded.toFixed(2),
      payment_gateway_used: (o.paymentGatewayNames || []).join(', ') || '-',
      fulfillment_status: o.displayFulfillmentStatus ?? '-',
      number_of_line_items: o.lineItemsCount,
      order_tags: o.tags || [],
      currency: o.currency,
    }));

    const formatTags = (tags: string[]) => (tags && tags.length > 0 ? tags.join(', ') : '-');
    const tableData = cleanOrders.map((r) => [
      r.order_id,
      r.order_name,
      r.customer_id,
      r.customer_name,
      r.order_date_time,
      r.order_status,
      r.total_order_value,
      r.subtotal,
      r.total_discounts_applied,
      r.taxes_collected,
      r.shipping_fee_charged,
      r.refund_amount,
      r.payment_gateway_used,
      r.fulfillment_status,
      r.number_of_line_items,
      formatTags(r.order_tags),
      r.currency,
    ]);

    const analyticsRaw = calculateOrderAnalytics(
      orders.map((o) => ({ total_price: o.totalPrice, customer_id: o.customer_id ?? undefined, moments_count: o.moments_count }))
    );

    return {
      displayed: {
        type: 'table',
        header: [
          'Order ID',
          'Order Name',
          'Customer ID',
          'Customer Name',
          'Order Date & Time',
          'Order Status',
          'Total Order Value',
          'Subtotal',
          'Total Discounts Applied',
          'Taxes Collected',
          'Shipping Fee',
          'Refund Amount',
          'Payment Gateway',
          'Fulfillment Status',
          'Number of Line Items',
          'Order Tags',
          'Currency',
        ],
        data: tableData,
      },
      data: cleanOrders,
      analytics: {
        metrics: {
          average_order_value: analyticsRaw.average_order_value,
          repeat_purchase_rate: analyticsRaw.repeat_purchase_rate,
          order_attributed_conversion_rate: analyticsRaw.conversion_rate,
          total_orders: analyticsRaw.total_orders,
          total_revenue: analyticsRaw.total_revenue,
          total_moments: analyticsRaw.total_moments,
        },
      },
    };
  }
}


