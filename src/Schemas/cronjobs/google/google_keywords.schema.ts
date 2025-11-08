import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'google_keywords'
})
export class GoogleKeyword extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  ad_group_id: string;

  @Prop({ required: true })
  keyword_text: string;

  @Prop({ required: true })
  keyword_id: string;

  @Prop({ required: true })
  match_type: string;

  @Prop({ required: true })
  keyword_status: string;

  @Prop()
  quality_score: number;

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
  average_cpc: number;

  @Prop()
  cost_micros: number;

  @Prop()
  view_through_conversions: number;

  @Prop()
  cost_per_conversion: number;

  @Prop()
  search_impression_share: number;

  @Prop()
  search_rank_lost_impression_share: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const GoogleKeywordSchema = SchemaFactory.createForClass(GoogleKeyword);

GoogleKeywordSchema.index({
  date: 1,
  keyword_id: 1,
  campaign_id: 1,
  ad_group_id: 1,
});
