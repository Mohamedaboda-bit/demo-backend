import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_geo_locations'
})
export class MetaGeoLocations extends Document {
  @Prop()
  campaign_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  country: string;

  @Prop()
  region: string;

  @Prop()
  spend: number;

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;

  @Prop()
  conversions: number;

  @Prop()
  conversion_value: number;

  @Prop()
  roas: number;

  @Prop()
  cost_per_result: number;

  @Prop()
  conversion_rate: number;

  @Prop()
  add_to_cart: number;

  @Prop()
  link_clicks: number;

  @Prop()
  cpc: number;

  @Prop()
  unique_outbound_ctr: number;

  @Prop()
  cpm: number;

  @Prop()
  frequency: number;

  @Prop()
  reach: number;
}

export const MetaGeoLocationsSchema = SchemaFactory.createForClass(MetaGeoLocations);

MetaGeoLocationsSchema.index({ campaign_id: 1, date: 1, country: 1, region: 1 });
MetaGeoLocationsSchema.index({ ad_account_id: 1, company_id: 1 });
