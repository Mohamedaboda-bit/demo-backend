import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Help extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;
}

export const HelpSchema = SchemaFactory.createForClass(Help);
