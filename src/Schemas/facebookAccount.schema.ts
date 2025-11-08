import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Company } from './company.schema';
import { FacebookToken } from './facebookToken.schema';

@Schema({
  timestamps: true,
})
export class UserFacebookAccount extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company', required: true, index: true })
  companyId: Company;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FacebookToken', required: true })
  facebookTokenId: FacebookToken;

  @Prop({ required: true })
  adAccountId: string;

  @Prop({ default: Date.now })
  lastSwitchedAt: Date;
}

export const UserFacebookAccountSchema = SchemaFactory.createForClass(UserFacebookAccount);

UserFacebookAccountSchema.index({ userId: 1, companyId: 1 }, { unique: true });
