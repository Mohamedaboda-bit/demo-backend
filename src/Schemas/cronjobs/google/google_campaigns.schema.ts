import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'google_campaigns'
})
export class GoogleCampaign extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  customer_id: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  campaign_name: string;

  @Prop({
    required: true,
    enum: [
      'UNSPECIFIED',
      'UNKNOWN',
      'SEARCH',
      'DISPLAY',
      'SHOPPING',
      'HOTEL',
      'VIDEO',
      'MULTI_CHANNEL',
      'LOCAL',
      'SMART',
      'PERFORMANCE_MAX',
      'LOCAL_SERVICES',
      'DISCOVERY',
      'TRAVEL_GOALS',
    ],
  })
  campaign_type: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  budget_amount: number;

  @Prop({
    required: true,
    enum: [
      'COMMISSION',
      'ENHANCED_CPC',
      'FIXED_CPM',
      'INVALID',
      'MANUAL_CPA',
      'MANUAL_CPC',
      'MANUAL_CPM',
      'MANUAL_CPV',
      'MAXIMIZE_CONVERSIONS',
      'MAXIMIZE_CONVERSION_VALUE',
      'PAGE_ONE_PROMOTED',
      'PERCENT_CPC',
      'TARGET_CPA',
      'TARGET_CPM',
      'TARGET_CPV',
      'TARGET_IMPRESSION_SHARE',
      'TARGET_OUTRANK_SHARE',
      'TARGET_ROAS',
      'TARGET_SPEND',
      'UNKNOWN',
      'UNSPECIFIED',
    ],
  })
  bidding_strategy_type: string;

  @Prop()
  start_date: Date;
  
  @Prop()
  end_date: Date;
  
  @Prop({ default: 0 })
  search_impression_share: number;

  @Prop({ default: 0 })
  search_budget_lost_impression_share: number;

  @Prop({ default: 0 })
  search_rank_lost_impression_share: number;

  @Prop()
  clicks: number;

  @Prop()
  impressions: number;
  
  @Prop()
  ctr: number;

  @Prop()
  average_cpc: number;

  @Prop()
  cost_micros: number;

  @Prop()
  conversions: number;

  @Prop()
  conversions_value: number;

  @Prop()
  cost_per_conversion: number;

  @Prop()
  view_through_conversions: number;

  @Prop()
  value_per_conversion: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const GoogleCampaignSchema = SchemaFactory.createForClass(GoogleCampaign);
