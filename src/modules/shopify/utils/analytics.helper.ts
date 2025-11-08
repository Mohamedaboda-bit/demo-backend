export interface OrderForAnalytics {
  total_price: number;
  customer_id?: string | number | null;
  moments_count?: number;
}

export function calculateOrderAnalytics(orders: OrderForAnalytics[] | null | undefined) {
  if (!orders || orders.length === 0) {
    return {
      average_order_value: 0,
      repeat_purchase_rate: 0,
      conversion_rate: 0,
      total_orders: 0,
      total_revenue: 0,
      total_moments: 0,
    };
  }

  const totalOrders = orders.length;
  let totalRevenue = 0;
  let totalMoments = 0;
  const customerOrderCount: Record<string | number, number> = {};

  orders.forEach((order) => {
    totalRevenue += Number(order.total_price) || 0;
    totalMoments += Number(order.moments_count) || 0;
    const customerId = order.customer_id;
    if (customerId !== undefined && customerId !== null && customerId !== '-') {
      customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
    }
  });

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = Object.keys(customerOrderCount).length;
  const returningCustomers = Object.values(customerOrderCount).filter((c) => c > 1).length;
  const repeatPurchaseRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
  const conversionRate = totalMoments > 0 ? (totalOrders / totalMoments) * 100 : 0;

  return {
    average_order_value: Number(averageOrderValue.toFixed(2)),
    repeat_purchase_rate: Number(repeatPurchaseRate.toFixed(2)),
    conversion_rate: Number(conversionRate.toFixed(2)),
    total_orders: totalOrders,
    total_revenue: Number(totalRevenue.toFixed(2)),
    total_moments: totalMoments,
  };
}

export interface CustomerForAnalytics {
  orders_count?: number | string;
  last_purchase_date?: string | null;
}

export function calculateCustomerAnalytics(customers: CustomerForAnalytics[] | null | undefined) {
  if (!customers || customers.length === 0) {
    return {
      churn_rate: 0,
      retention_rate: 0,
    };
  }

  const currentDate = new Date();
  const churnThresholdDays = 90;
  let inactiveCustomers = 0;
  let returningCustomers = 0;

  customers.forEach((customer) => {
    const orders = Number(customer.orders_count) || 0;
    if (customer.last_purchase_date) {
      const daysSinceLast = (currentDate.getTime() - new Date(customer.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLast > churnThresholdDays) inactiveCustomers += 1;
    } else {
      inactiveCustomers += 1;
    }
    if (orders > 1) returningCustomers += 1;
  });

  const totalCustomers = customers.length;
  const churnRate = totalCustomers > 0 ? (inactiveCustomers / totalCustomers) * 100 : 0;
  const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

  return {
    churn_rate: Number(churnRate.toFixed(2)),
    retention_rate: Number(retentionRate.toFixed(2)),
  };
}


