import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class KlaviyoToken extends Document {
  @Prop({ required: false })
  userId: string;

  @Prop({ unique: true })
  accessToken: string;

  @Prop({ unique: true })
  refreshToken: string;

  @Prop({ unique: true })
  expiryDate: number;
}

export const KlaviyoTokenSchema = SchemaFactory.createForClass(KlaviyoToken);
