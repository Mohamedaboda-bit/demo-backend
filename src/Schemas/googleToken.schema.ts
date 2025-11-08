import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GoogleToken extends Document {
  @Prop({ required: false })
  companyId: string;

  @Prop({ required: false })
  accessToken: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop()
  expiryDate: number;

  @Prop({ required: true })
  googleId: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const GoogleTokenSchema = SchemaFactory.createForClass(GoogleToken);

GoogleTokenSchema.pre('init', function (this: GoogleToken, next: (err?: Error) => void) {
  if (this.createdAt && typeof this.createdAt === 'object') {
      (this as any).createdAt = new Date((this.createdAt as any).$date);
  }
  if (this.updatedAt && typeof this.updatedAt === 'object') {
    (this as any).updatedAt = new Date((this.updatedAt as any).$date);
  }
  next();
});
