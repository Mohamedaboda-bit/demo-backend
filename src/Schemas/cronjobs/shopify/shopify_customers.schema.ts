import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'shopify_customers' })
export class ShopifyCustomer extends Document {
  @Prop({ required: true })
  company_id: string;

  @Prop({ required: true, unique: true })
  customerId: string;

  @Prop()
  totalSpent: string;

  @Prop()
  ordersCount: number;

  @Prop([String])
  tags: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ShopifyCustomerSchema = SchemaFactory.createForClass(ShopifyCustomer);
