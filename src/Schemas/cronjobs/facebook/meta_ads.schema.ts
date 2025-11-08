import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at' },
  collection: 'meta_ads',
})
export class MetaAd extends Document {
  @Prop({ required: true, unique: true })
  ad_id: string;

  @Prop({ required: true })
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  adset_id: string;

  @Prop()
  campaign_id: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  creative_id: string;

  @Prop()
  image_url: string;

  @Prop()
  format: string;
}

export const MetaAdSchema = SchemaFactory.createForClass(MetaAd);

MetaAdSchema.index({ ad_account_id: 1, company_id: 1 });
MetaAdSchema.index({ ad_id: 1, ad_account_id: 1 });
