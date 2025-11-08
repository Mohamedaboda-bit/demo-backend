import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class MoneySet {
    @Prop()
    amount: string;
    @Prop()
    currency_code: string;
}
const MoneySetSchema = SchemaFactory.createForClass(MoneySet);

@Schema({ _id: false })
class Refund {
    @Prop()
    id: number;
    @Prop()
    order_id: number;
    @Prop()
    created_at: string;
    @Prop()
    note: string;
    @Prop()
    user_id: number;
    @Prop()
    processed_at: string;
    @Prop({ type: [MongooseSchema.Types.Mixed] })
    refund_line_items: any[];
    @Prop({ type: [MongooseSchema.Types.Mixed] })
    transactions: any[];
    @Prop({ type: [MongooseSchema.Types.Mixed] })
    order_adjustments: any[];
}
const RefundSchema = SchemaFactory.createForClass(Refund);

@Schema({ _id: false })
class DefaultAddress {
    @Prop()
    id: string;
    @Prop()
    city: string;
    @Prop()
    province: string;
    @Prop()
    country: string;
    @Prop()
    zip: string;
    @Prop()
    province_code: string;
    @Prop()
    country_code: string;
    @Prop()
    country_name: string;
}
const DefaultAddressSchema = SchemaFactory.createForClass(DefaultAddress);

@Schema({ _id: false })
class Customer {
    @Prop()
    id: string;
    @Prop()
    created_at: string;
    @Prop({ type: DefaultAddressSchema})
    default_address: DefaultAddress;
}
const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema({ _id: false })
class LineItem {
    @Prop()
    id: number;
    @Prop()
    fulfillment_status: string;
    @Prop()
    name: string;
    @Prop()
    price: string;
    @Prop()
    product_id: number;
    @Prop()
    quantity: number;
    @Prop()
    requires_shipping: boolean;
    @Prop()
    sku: string;
    @Prop()
    taxable: boolean;
    @Prop()
    title: string;
    @Prop()
    total_discount: string;
}
const LineItemSchema = SchemaFactory.createForClass(LineItem);

@Schema({ _id: false })
class ShippingLine {
    @Prop()
    id: number;
    @Prop()
    carrier_identifier: string;
    @Prop()
    name: string;
    @Prop()
    code: string;
    @Prop()
    discounted_price: string;
    @Prop()
    price: string;
}
const ShippingLineSchema = SchemaFactory.createForClass(ShippingLine);

@Schema({ collection: 'orders', id: false })
export class ShopifyOrders extends Document {
    @Prop({ unique: true })
    declare id: number;
    @Prop()
    app_id: number;
    @Prop()
    browser_ip: string;
    @Prop()
    cancel_reason: string;
    @Prop()
    cancelled_at: Date;
    @Prop()
    closed_at: Date;
    @Prop()
    created_at: Date;
    @Prop()
    currency: string;
    @Prop()
    current_total_price: string;
    @Prop()
    current_total_tax: string;
    @Prop()
    current_total_discounts: string;
    @Prop({ type: { shop_money: MoneySetSchema, presentment_money: MoneySetSchema }})
    current_total_discounts_set: { shop_money: MoneySet, presentment_money: MoneySet };
    @Prop({ type: { shop_money: MoneySetSchema, presentment_money: MoneySetSchema }})
    current_total_duties_set: { shop_money: MoneySet, presentment_money: MoneySet };
    @Prop()
    financial_status: string;
    @Prop()
    fulfillment_status: string;
    @Prop()
    order_number: number;
    @Prop()
    subtotal_price: string;
    @Prop()
    total_discounts: string;
    @Prop()
    total_line_items_price: string;
    @Prop()
    total_outstanding: string;
    @Prop()
    total_price: string;
    @Prop({ type: { shop_money: MoneySetSchema, presentment_money: MoneySetSchema }})
    total_shipping_price_set: { shop_money: MoneySet, presentment_money: MoneySet };
    @Prop()
    total_tax: string;
    @Prop({ type: [RefundSchema] })
    refunds: Refund[];
    @Prop()
    updated_at: Date;
    @Prop()
    user_id: string;
    @Prop({ type: CustomerSchema })
    customer: Customer;
    @Prop({ type: [LineItemSchema] })
    line_items: LineItem[];
    @Prop({ type: [ShippingLineSchema] })
    shipping_lines: ShippingLine[];
}

export const ShopifyOrdersSchema = SchemaFactory.createForClass(ShopifyOrders);
