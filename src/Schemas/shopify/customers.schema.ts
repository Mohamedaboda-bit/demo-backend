import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'customers', id: false })
export class ShopifyCustomers extends Document {
  @Prop({ required: true, unique: true })
  declare id: number;

  @Prop()
  email: string;

  @Prop()
  first_name: string;
  
  @Prop()
  last_name: string;

  @Prop()
  orders_count: number;

  @Prop()
  total_spent: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ShopifyCustomersSchema = SchemaFactory.createForClass(ShopifyCustomers);
