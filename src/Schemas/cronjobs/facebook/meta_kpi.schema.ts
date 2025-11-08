import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_kpis'
})
export class MetaKpi extends Document {
  @Prop()
  campaign_name: string;

  @Prop({ required: true })
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  date: Date;

  @Prop()
  spend: number;

  @Prop()
  conv: number;

  @Prop()
  roas: number;

  @Prop()
  cpa: number;

  @Prop()
  impressions: number;

  @Prop()
  conversions: number;

  @Prop({ default: 0 })
  clicks: number;
}

export const MetaKpiSchema = SchemaFactory.createForClass(MetaKpi);

MetaKpiSchema.index({ campaign_name: 1, date: 1 }, { unique: true });
MetaKpiSchema.index({ ad_account_id: 1, company_id: 1 });
