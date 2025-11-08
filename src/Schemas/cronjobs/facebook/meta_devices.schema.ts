import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_devices'
})
export class MetaDevices extends Document {
  @Prop()
  campaign_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  device: string;

  @Prop()
  spend: number;

  @Prop()
  link_clicks: number;

  @Prop()
  conversions: number;

  @Prop()
  conversion_value: number;

  @Prop()
  clicks: number;

  @Prop()
  video_avg_time: number;

  @Prop()
  outbound_clicks: number;

  @Prop()
  impressions: number;

  @Prop()
  engagement_metrics: string;
}

export const MetaDevicesSchema = SchemaFactory.createForClass(MetaDevices);

MetaDevicesSchema.index({ campaign_id: 1, date: 1, device: 1 }, { unique: true });
MetaDevicesSchema.index({ ad_account_id: 1, company_id: 1 });
