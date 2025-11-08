import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class Headline {
  @Prop()
  pinnedField: string;
  @Prop()
  text: string;
  @Prop()
  assetPerformanceLabel: string;
  @Prop({ type: MongooseSchema.Types.Mixed })
  policySummaryInfo: any;
}
const HeadlineSchema = SchemaFactory.createForClass(Headline);

@Schema({ _id: false })
class Description {
  @Prop()
  text: string;
  @Prop()
  assetPerformanceLabel: string;
  @Prop({ type: MongooseSchema.Types.Mixed })
  policySummaryInfo: any;
}
const DescriptionSchema = SchemaFactory.createForClass(Description);

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'google_ads'
})
export class GoogleAd extends Document {
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
  ad_id: string;

  @Prop({ required: true })
  ad_name: string;
  
  @Prop({ required: true })
  ad_type: string;

  @Prop({ required: true })
  image_url: string;

  @Prop({ type: [HeadlineSchema] })
  headlines: Headline[];

  @Prop({ type: [DescriptionSchema] })
  descriptions: Description[];

  @Prop()
  headline_part1: string;

  @Prop()
  headline_part2: string;

  @Prop()
  headline_part3: string;
  
  @Prop()
  description1: string;

  @Prop()
  description2: string;

  @Prop()
  final_url: string;

  @Prop()
  device: string;

  @Prop({ required: true })
  status: string;

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

export const GoogleAdSchema = SchemaFactory.createForClass(GoogleAd);

GoogleAdSchema.index({ ad_id: 1, date: 1, device: 1 }, { unique: true });
