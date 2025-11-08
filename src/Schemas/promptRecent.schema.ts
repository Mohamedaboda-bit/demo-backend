import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class Option {
  @Prop()
  label: string;
}
const OptionSchema = SchemaFactory.createForClass(Option);

@Schema({ _id: false })
class DateRange {
  @Prop()
  startDate: string;
  @Prop()
  endDate: string;
}
const DateRangeSchema = SchemaFactory.createForClass(DateRange);

@Schema({ _id: false })
class PromptResponse {
  @Prop({ required: true })
  question: string;
  @Prop({ required: true })
  response: string;
}
const PromptResponseSchema = SchemaFactory.createForClass(PromptResponse);

@Schema({ _id: false })
class Metric {
  @Prop({ required: true })
  metric: string;
  @Prop({ required: true, default: true })
  isShowResult: boolean;
}
const MetricSchema = SchemaFactory.createForClass(Metric);

@Schema({ _id: false })
class PromptBody {
  @Prop({ required: true })
  question: string;
  @Prop({ type: [MetricSchema], required: true })
  required_metrics: Metric[];
}
const PromptBodySchema = SchemaFactory.createForClass(PromptBody);

@Schema({ timestamps: true })
export class PromptRecent extends Document {
  @Prop({ required: true })
  promptId: string;

  @Prop({ required: true })
  channel: string;

  @Prop({ required: true })
  label: string;

  @Prop({ type: [DateRangeSchema] })
  date_range: DateRange[];

  @Prop({ type: [DateRangeSchema] })
  compare_date_range: DateRange[];

  @Prop({ required: true })
  prompt: string;

  @Prop({ type: [PromptBodySchema], required: true })
  prompt_body: PromptBody[];

  @Prop({ required: true })
  response: string;

  @Prop({ type: [PromptResponseSchema], required: true })
  responses: PromptResponse[];

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  metricsResult: any[];

  @Prop({ type: [OptionSchema], required: true })
  CHANNELS: Option[];

  @Prop({ type: [OptionSchema], required: true })
  KPIS: Option[];

  @Prop({ type: [OptionSchema], required: true })
  DATE_RANGE: Option[];

  @Prop({ type: [OptionSchema], required: true })
  PRODUCT: Option[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const PromptRecentSchema = SchemaFactory.createForClass(PromptRecent);
