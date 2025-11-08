import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'google_products' })
export class GoogleProducts extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  product_title: string;

  @Prop()
  product_category1: string;
  @Prop()
  product_category2: string;
  @Prop()
  product_category3: string;
  @Prop()
  product_category4: string;
  @Prop()
  product_category5: string;

  @Prop({ required: true })
  brand: string;
  
  @Prop()
  product_type1: string;
  @Prop()
  product_type2: string;
  @Prop()
  product_type3: string;
  @Prop()
  product_type4: string;
  @Prop()
  product_type5: string;

  @Prop()
  cost_micros: number;
  
  @Prop()
  clicks: number;

  @Prop()
  impressions: number;
  
  @Prop()
  ctr: number;

  @Prop()
  conversions: number;

  @Prop()
  conversions_value: number;

  @Prop()
  value_per_conversion: number;

  @Prop()
  cost_per_conversion: number;

  @Prop()
  average_cpc: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
  
  @Prop()
  campaign_id: string;
  
  @Prop()
  campaign_type: string;
}

export const GoogleProductsSchema = SchemaFactory.createForClass(GoogleProducts);

GoogleProductsSchema.index({
  product_id: 1,
  date: 1,
  campaign_id: 1,
  companyId: 1,
});
