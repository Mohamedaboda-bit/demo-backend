import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'google_devices' })
export class GoogleDevice extends Document {
  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  adGroup: string;

  @Prop({ required: true })
  adGroupName: string;
  
  @Prop({ required: true })
  device: string;

  @Prop()
  cost_micros: number;

  @Prop()
  conversions: number;

  @Prop()
  conversions_value: number;

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;
  
  @Prop()
  view_through_conversions: number;

  @Prop()
  cost_per_conversion: number;

  @Prop()
  average_cpc: number;

  @Prop()
  ctr: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const GoogleDeviceSchema = SchemaFactory.createForClass(GoogleDevice);

GoogleDeviceSchema.index({ device: 1, date: 1, adAccountId: 1, adGroup: 1 });
