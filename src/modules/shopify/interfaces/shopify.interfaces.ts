export interface DisplayTable {
  type: 'table';
  header: string[];
  data: (string | number)[][];
}

export interface ShopifyOrdersAnalyticsMetrics {
  average_order_value: number; // AOV
  repeat_purchase_rate: number; // RPR %
  order_attributed_conversion_rate?: number; // optional for parity
  total_orders?: number;
  total_revenue?: number;
  total_moments?: number;
}

export interface ShopifyOrdersAnalytics {
  metrics: ShopifyOrdersAnalyticsMetrics;
}

export interface CleanShopifyOrder {
  order_id: string | number | '-';
  order_name: string | '-';
  customer_id: string | number | '-';
  customer_name: string | '-';
  order_date_time: string | '-';
  order_status: string | '-';
  total_order_value: string; // fixed 2 decimals
  subtotal: string;
  total_discounts_applied: string;
  taxes_collected: string;
  shipping_fee_charged: string;
  refund_amount: string;
  payment_gateway_used: string | '-';
  fulfillment_status: string | '-';
  number_of_line_items: number;
  order_tags: string[];
  currency: string;
}

export interface ShopifyOrdersResponse {
  displayed: DisplayTable;
  data: CleanShopifyOrder[];
  analytics: ShopifyOrdersAnalytics;
}

export interface ShopifyCustomersAnalyticsMetrics {
  churn_rate: number;
  retention_rate: number;
}

export interface ShopifyCustomersAnalytics {
  metrics: ShopifyCustomersAnalyticsMetrics;
}

export interface CleanShopifyCustomerAddress {
  country: string;
  state: string;
  city: string;
  zip_code: string;
}

export interface CleanShopifyCustomer {
  customer_id: string | number | '-';
  customer_name: string | '-';
  email: string | '-';
  phone: string | '-';
  billing_address: CleanShopifyCustomerAddress | '-';
  shipping_address: CleanShopifyCustomerAddress | '-';
  total_orders_placed: number | '-';
  total_spent: string | '-';
  customer_lifetime_value: number | string | '-';
  average_order_value: number | string | '-';
  first_purchase_date: string | '-';
  last_purchase_date: string | '-';
  total_discounts_received: number | string | '-';
  customer_tags: string[];
  email_subscription_status: string | '-';
}

export interface ShopifyCustomersResponse {
  displayed: DisplayTable;
  data: CleanShopifyCustomer[];
  analytics: ShopifyCustomersAnalytics;
}


