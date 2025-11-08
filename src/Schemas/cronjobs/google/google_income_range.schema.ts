import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'google_income_ranges'
})
export class GoogleIncomeRange extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  ad_group_id: string;

  @Prop({ required: true })
  income_range: string;

  @Prop({ required: true })
  status: string;

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

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const GoogleIncomeRangeSchema = SchemaFactory.createForClass(GoogleIncomeRange);

GoogleIncomeRangeSchema.index({ income_range: 1, date: 1, ad_group_id: 1 });
