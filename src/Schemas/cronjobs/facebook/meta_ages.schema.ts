import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_ages',
})
export class MetaAges extends Document {
  @Prop()
  campaign_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  age: string;

  @Prop()
  impressions: number;

  @Prop()
  reach: number;

  @Prop()
  clicks: number;

  @Prop()
  link_clicks: number;

  @Prop()
  spend: number;

  @Prop()
  conversions: number;

  @Prop()
  add_to_cart: number;

  @Prop()
  video_views: number;

  @Prop()
  engagements: number;

  @Prop()
  outbound_clicks: number;

  @Prop()
  conversion_value: number;
}

export const MetaAgesSchema = SchemaFactory.createForClass(MetaAges);

MetaAgesSchema.index({ campaign_id: 1, date: 1 });
MetaAgesSchema.index({ ad_account_id: 1, company_id: 1 });
