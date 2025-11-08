import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Inventory {
  @Prop()
  inventoryItemId: string;

  @Prop()
  locationId: string;

  @Prop()
  availableQuantity: number;

  @Prop()
  updatedAt: Date;
}
const InventorySchema = SchemaFactory.createForClass(Inventory);

@Schema({ _id: false })
class Variant {
  @Prop({ required: true })
  variantId: string;

  @Prop()
  title: string;

  @Prop()
  price: string;
  
  @Prop()
  sku: string;

  @Prop()
  inventoryQuantity: number;

  @Prop({ type: [InventorySchema] })
  inventory: Inventory[];
}
const VariantSchema = SchemaFactory.createForClass(Variant);

@Schema({ collection: 'shopify_products' })
export class ShopifyProduct extends Document {
  @Prop({ required: true })
  company_id: string;

  @Prop({ required: true, unique: true })
  productId: string;

  @Prop()
  title: string;

  @Prop()
  vendor: string;

  @Prop()
  productType: string;

  @Prop([String])
  tags: string[];

  @Prop()
  price: string;

  @Prop([String])
  images: string[];

  @Prop({ type: [VariantSchema] })
  variants: Variant[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ShopifyProductSchema = SchemaFactory.createForClass(ShopifyProduct);
