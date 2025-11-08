import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'google_locations' })
export class GoogleLocations extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  campaign_type: string;

  @Prop({ required: true })
  campaign_name: string;

  @Prop({ required: true })
  country_id: string;

  @Prop({ required: true })
  geo_target_region_id: string;

  @Prop({ required: true })
  geo_target_region_name: string;

  @Prop()
  geo_target_region_country_code: string;

  @Prop()
  geo_target_region_target_type: string;

  @Prop()
  geo_target_region_target_canonical_name: string;

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
  cost_micros: number;

  @Prop()
  average_cpc: number;

  @Prop()
  cost_per_conversion: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
  
  @Prop()
  geo_target_region_status: string;
}

export const GoogleLocationsSchema = SchemaFactory.createForClass(GoogleLocations);

GoogleLocationsSchema.index({
  campaign_id: 1,
  geo_target_region_id: 1,
  date: 1,
});
