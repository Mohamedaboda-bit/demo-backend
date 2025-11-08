import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ShopifyToken extends Document {
  @Prop({ required: false })
  userId: string;

  @Prop({ required: false })
  companyId: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 250,
    unique: true,
  })
  shopName: string;

  @Prop({ unique: true })
  accessToken: string;
}

export const ShopifyTokenSchema = SchemaFactory.createForClass(ShopifyToken);
