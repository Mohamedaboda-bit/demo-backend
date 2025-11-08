import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_insights'
})
export class MetaInsights extends Document {
  @Prop()
  ad_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  adset_id: string;

  @Prop()
  campaign_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;

  @Prop()
  spend: number;

  @Prop()
  conversions: number;

  @Prop()
  conversion_value: number;

  @Prop()
  add_to_cart: number;

  @Prop()
  cost_per_add_to_cart: number;

  @Prop()
  link_clicks: number;

  @Prop()
  outbound_clicks: number;

  @Prop()
  landing_page_view: number;

  @Prop()
  video_views: number;

  @Prop()
  video_avg_time: number;

  @Prop()
  post_engagements: number;

  @Prop()
  post_reaction: number;
}

export const MetaInsightsSchema = SchemaFactory.createForClass(MetaInsights);

MetaInsightsSchema.index({ ad_id: 1, date: 1 }, { unique: true });
MetaInsightsSchema.index({ ad_account_id: 1, company_id: 1 });
MetaInsightsSchema.index({ ad_account_id: 1, date: 1 });
