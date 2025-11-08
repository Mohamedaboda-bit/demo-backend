import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GoogleAccounts extends Document {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  adAccountId: string;

  @Prop({ required: true })
  adAccountName: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  googleId: string;

  @Prop()
  pullData: string;

  @Prop({ required: false })
  lastSyncAt: Date;
}

export const GoogleAccountsSchema = SchemaFactory.createForClass(GoogleAccounts);
