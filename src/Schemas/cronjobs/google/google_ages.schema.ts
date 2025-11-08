import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'google_ages'
})
export class GoogleAge extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  ad_group_id: string;

  @Prop({
    required: true,
    enum: [
      'UNKNOWN',
      'AGE_RANGE_18_24',
      'AGE_RANGE_25_34',
      'AGE_RANGE_35_44',
      'AGE_RANGE_45_54',
      'AGE_RANGE_55_64',
      'AGE_RANGE_65_UP',
    ],
  })
  age_range: string;

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

export const GoogleAgeSchema = SchemaFactory.createForClass(GoogleAge);

GoogleAgeSchema.index({ age_range: 1, date: 1, ad_group_id: 1 });
