import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Metric extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: 'GET' })
  request: string;

  @Prop({ required: true })
  chart: string;

  @Prop({ required: true, default: false })
  deleted: boolean;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);
