import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'google_ad_groups'
})
export class GoogleAdGroup extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  customer_id: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  ad_group_id: string;

  @Prop({ required: true })
  ad_group_name: string;

  @Prop({ required: true })
  status: string;

  @Prop([String])
  type: string[];

  @Prop([String])
  primary_status: string[];

  @Prop([String])
  primary_status_reasons: string[];

  @Prop()
  cpc_bid: number;

  @Prop()
  cpm_bid_micros: number;

  @Prop()
  cpv_bid_micros: number;

  @Prop()
  effective_cpc_bid_micros: number;

  @Prop()
  target_cpa_micros: number;

  @Prop()
  target_cpm_micros: number;

  @Prop()
  target_cpv_micros: number;

  @Prop()
  target_roas: number;

  @Prop({ default: 0 })
  search_impression_share: number;

  @Prop({ default: 0 })
  search_rank_lost_impression_share: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const GoogleAdGroupSchema = SchemaFactory.createForClass(GoogleAdGroup);
