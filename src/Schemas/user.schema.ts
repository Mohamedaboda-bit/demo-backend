import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'admin' })
  role: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ default: undefined })
  clientType: string;

  @Prop({ default: undefined })
  customerRole: string;

  @Prop({ default: '' })
  profileImageKey: string;

  @Prop({ default: '/profile.png' })
  profilePicture: string;

  @Prop({ default: null })
  resetPasswordToken: string;

  @Prop({ default: null })
  resetPasswordExpires: number;

  @Prop({ required: true, default: false })
  pullSocials: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
