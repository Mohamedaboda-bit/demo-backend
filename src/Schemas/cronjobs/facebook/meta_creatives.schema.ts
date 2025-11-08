import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_creatives'
})
export class MetaCreative extends Document {
  @Prop({ required: true, unique: true })
  creative_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  ad_id: string;

  @Prop()
  adset_id: string;

  @Prop()
  campaign_id: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  thumbnail_url: string;

  @Prop()
  image_url: string;

  @Prop()
  video_url: string;

  @Prop()
  headline: string;

  @Prop()
  primary_text: string;

  @Prop()
  cta_text: string;

  @Prop()
  destination_url: string;
  
  @Prop()
  date: Date;
}

export const MetaCreativeSchema = SchemaFactory.createForClass(MetaCreative);

MetaCreativeSchema.index({ ad_account_id: 1, company_id: 1 });
MetaCreativeSchema.index({ creative_id: 1, ad_account_id: 1 });
