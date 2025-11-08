import { Injectable } from '@nestjs/common';
import { ShopifyConfigService } from '../config/shopify.config';
import { ShopifyCustomersResponse, CleanShopifyCustomer } from '../interfaces/shopify.interfaces';
import { calculateCustomerAnalytics } from '../utils/analytics.helper';

const PAGE_SIZE = 250;
const REQUEST_DELAY_MS = 1000;

@Injectable()
export class ShopifyCustomersService {
  constructor(private readonly shopifyConfig: ShopifyConfigService) {}

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllCustomers(startDate?: string | null, endDate?: string | null): Promise<ShopifyCustomersResponse> {
    const client = this.shopifyConfig.getGraphqlClient();

    let customers: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    let retryCount = 0;

    let dateQuery = '';
    if (startDate && endDate) dateQuery = `customer_date:>='${startDate}' AND customer_date:<='${endDate}'`;
    else if (startDate) dateQuery = `customer_date:>='${startDate}'`;
    else if (endDate) dateQuery = `customer_date:<='${endDate}'`;

    while (hasNextPage && retryCount < 5) {
      try {
        const query = `
          query getCustomers($first: Int!, $after: String, $query: String) {
            customers(first: $first, after: $after, query: $query) {
              edges {
                node {
                  id
                  legacyResourceId
                  email
                  firstName
                  lastName
                  displayName
                  defaultPhoneNumber { phoneNumber }
                  createdAt
                  updatedAt
                  state
                  note
                  verifiedEmail
                  taxExempt
                  numberOfOrders
                  amountSpent { amount currencyCode }
                  tags
                  defaultEmailAddress { emailAddress marketingState }
                  defaultAddress { id address1 address2 city province provinceCode country countryCode zip phone }
                  lastOrder { id createdAt currentTotalDiscountsSet { shopMoney { amount currencyCode } } }
                  orders(first: 1, reverse: false, sortKey: CREATED_AT) { edges { node { id createdAt } } }
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        `;

        const variables: any = { first: PAGE_SIZE, after: cursor, query: dateQuery || null };
        const response: any = await client.request(query, { variables });
        const edges = response.data?.customers?.edges || [];
        const pageInfo = response.data?.customers?.pageInfo || { hasNextPage: false, endCursor: null };

        const transformed = edges.map((edge: any) => {
          const node = edge.node;
          const ordersCount = Number(node.numberOfOrders) || 0;
          const totalSpent = parseFloat(node.amountSpent?.amount) || 0;
          const averageOrderValue = ordersCount > 0 ? totalSpent / ordersCount : 0;
          const firstPurchaseDate = node.orders?.edges?.[0]?.node?.createdAt || null;
          const lastPurchaseDate = node.lastOrder?.createdAt || null;
          const totalDiscountsReceived = parseFloat(node.lastOrder?.currentTotalDiscountsSet?.shopMoney?.amount) || 0;
          return {
            id: node.legacyResourceId,
            email: node.email,
            first_name: node.firstName,
            last_name: node.lastName,
            display_name: node.displayName,
            phone: node.defaultPhoneNumber?.phoneNumber || null,
            created_at: node.createdAt,
            updated_at: node.updatedAt,
            state: node.state,
            note: node.note,
            verified_email: node.verifiedEmail,
            tax_exempt: node.taxExempt,
            orders_count: ordersCount,
            total_spent: totalSpent.toFixed(2),
            total_spent_currency: node.amountSpent?.currencyCode || 'USD',
            first_purchase_date: firstPurchaseDate,
            last_purchase_date: lastPurchaseDate,
            average_order_value: averageOrderValue,
            lifetime_value: totalSpent,
            total_discounts_received: totalDiscountsReceived,
            email_subscription_status: node.defaultEmailAddress?.marketingState || 'UNKNOWN',
            tags: node.tags || [],
            default_address: node.defaultAddress || null,
            billing_address: node.defaultAddress || null,
            shipping_address: node.defaultAddress || null,
            addresses: (node.addresses?.edges || []).map((e: any) => e.node) || [],
          };
        });

        customers = customers.concat(transformed);
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

    const cleanCustomers: CleanShopifyCustomer[] = customers.map((c): CleanShopifyCustomer => {
      const totalSpent = parseFloat(c.total_spent) || 0;
      const totalOrders = Number(c.orders_count) || 0;
      const customerLTV = totalOrders > 0 ? parseFloat((totalSpent / totalOrders).toFixed(2)) : 0;
      return {
        customer_id: c.id ?? '-',
        customer_name: c.display_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '-',
        email: c.email || '-',
        phone: c.phone || '-',
        billing_address: c.billing_address
          ? {
              country: c.billing_address.country || '-',
              state: c.billing_address.province || '-',
              city: c.billing_address.city || '-',
              zip_code: c.billing_address.zip || '-',
            }
          : '-' as '-',
        shipping_address: c.shipping_address
          ? {
              country: c.shipping_address.country || '-',
              state: c.shipping_address.province || '-',
              city: c.shipping_address.city || '-',
              zip_code: c.shipping_address.zip || '-',
            }
          : '-' as '-',
        total_orders_placed: c.orders_count ?? '-',
        total_spent: c.total_spent || '-',
        customer_lifetime_value: customerLTV || '-',
        average_order_value: c.average_order_value ?? '-',
        first_purchase_date: c.first_purchase_date || '-',
        last_purchase_date: c.last_purchase_date || '-',
        total_discounts_received: c.total_discounts_received ?? '-',
        customer_tags: c.tags || [],
        email_subscription_status: c.email_subscription_status || '-',
      };
    });

    const formatAddress = (address: any) => {
      if (!address || address === '-') return '-';
      const parts = [address.city, address.state, address.country, address.zip_code].filter((p) => p && p !== '-');
      return parts.length > 0 ? parts.join(', ') : '-';
    };

    const tableData = cleanCustomers.map((c) => [
      c.customer_id,
      c.customer_name,
      c.email,
      c.phone,
      formatAddress(c.billing_address),
      formatAddress(c.shipping_address),
      c.total_orders_placed ?? '-',
      c.total_spent,
      c.customer_lifetime_value ?? '-',
      c.average_order_value ?? '-',
      c.first_purchase_date,
      c.last_purchase_date,
      c.total_discounts_received ?? '-',
      (c.customer_tags || []).length > 0 ? c.customer_tags.join(', ') : '-',
      c.email_subscription_status,
    ]);

    const analyticsRaw = calculateCustomerAnalytics(
      customers.map((cc) => ({ orders_count: cc.orders_count, last_purchase_date: cc.last_purchase_date }))
    );

    return {
      displayed: {
        type: 'table',
        header: [
          'Customer ID',
          'Customer Name',
          'Email',
          'Phone Number',
          'Billing Address',
          'Shipping Address',
          'Total Orders Placed',
          'Total Spent',
          'Customer Lifetime Value (LTV)',
          'Average Order Value',
          'First Purchase Date',
          'Last Purchase Date',
          'Total Discounts Received',
          'Customer Tags',
          'Email Subscription Status',
        ],
        data: tableData,
      },
      data: cleanCustomers,
      analytics: {
        metrics: {
          churn_rate: analyticsRaw.churn_rate,
          retention_rate: analyticsRaw.retention_rate,
        },
      },
    };
  }
}


