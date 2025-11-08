import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'shopify_orders' })
export class ShopifyOrder extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  companyId: MongooseSchema.Types.ObjectId;

  @Prop()
  orderId: number;

  @Prop()
  orderName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop()
  orderDateTime: Date;

  @Prop()
  orderStatus: string;

  @Prop()
  totalOrderValue: number;

  @Prop()
  subtotal: number;

  @Prop()
  totalDiscounts: number;

  @Prop()
  taxesCollected: number;

  @Prop()
  shippingFee: number;
  
  @Prop()
  refundAmount: number;

  @Prop()
  paymentGateway: string;

  @Prop()
  fulfillmentStatus: string;

  @Prop()
  lineItemsCount: number;

  @Prop([String])
  tags: string[];

  @Prop()
  currency: string;
}

export const ShopifyOrderSchema = SchemaFactory.createForClass(ShopifyOrder);
