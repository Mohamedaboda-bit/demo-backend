import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_replacements'
})
export class MetaReplacements extends Document {
  @Prop()
  campaign_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  publisher_platform: string;

  @Prop()
  platform_position: string;

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;

  @Prop()
  spend: number;

  @Prop()
  conversions: number;

  @Prop()
  conversion_value: number;

  @Prop()
  add_to_cart: number;

  @Prop()
  link_clicks: number;

  @Prop()
  landing_page_view: number;

  @Prop()
  outbound_clicks: number;
}

export const MetaReplacementsSchema = SchemaFactory.createForClass(MetaReplacements);

MetaReplacementsSchema.index({ campaign_id: 1, date: 1 });
MetaReplacementsSchema.index({ ad_account_id: 1, company_id: 1 });
