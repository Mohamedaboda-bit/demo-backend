import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class ImageAsset {
  @Prop()
  url: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  type: string;
}
const ImageAssetSchema = SchemaFactory.createForClass(ImageAsset);

@Schema({ collection: 'google_creatives' })
export class GoogleCreative extends Document {
  @Prop()
  adAccountId: string;

  @Prop()
  company_id: string;

  @Prop()
  ad_id: string;

  @Prop()
  ad_type: string;

  @Prop()
  campaign_id: string;
  
  @Prop()
  campaign_name: string;

  @Prop()
  ad_group_id: string;

  @Prop()
  ad_group_name: string;

  @Prop()
  status: string;
  
  @Prop()
  ad_strength: string;

  @Prop([String])
  headlines: string[];

  @Prop([String])
  descriptions: string[];

  @Prop({ type: [ImageAssetSchema] })
  image_assets: ImageAsset[];

  @Prop([String])
  final_urls: string[];

  @Prop([String])
  final_mobile_urls: string[];

  @Prop([String])
  final_app_urls: string[];
  
  @Prop([String])
  display_urls: string[];

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;
  
  @Prop()
  cost_micros: number;
  
  @Prop()
  conversions: number;

  @Prop()
  conversions_value: number;
  
  @Prop()
  ctr: number;

  @Prop()
  average_cpc: number;

  @Prop()
  conversion_rate: number;

  @Prop()
  cost_per_conversion: number;

  @Prop()
  value_per_conversion: number;

  @Prop()
  value_cost_ratio: number;

  @Prop()
  date: string;
}

export const GoogleCreativeSchema = SchemaFactory.createForClass(GoogleCreative);
