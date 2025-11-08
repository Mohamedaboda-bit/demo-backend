import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

@Schema()
export class Prompts extends Document {
  @Prop({ required: true })
  channel: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ type: [PromptBodySchema], required: true })
  prompt_body: PromptBody[];

  @Prop({ required: true, default: true })
  enabled: boolean;

  @Prop({ required: true, default: false })
  deleted: boolean;

  @Prop({ required: true, default: true })
  isSendOpenAI: boolean;

  @Prop({ required: true, default: false })
  isAutomation: boolean;
}

export const PromptsSchema = SchemaFactory.createForClass(Prompts);
