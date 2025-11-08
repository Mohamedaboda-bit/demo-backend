import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Method extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  chart: string;

  @Prop([String])
  params: string[];
}

export const MethodSchema = SchemaFactory.createForClass(Method);
