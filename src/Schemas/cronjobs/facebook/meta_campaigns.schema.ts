import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_campaigns',
})
export class MetaCampaign extends Document {
  @Prop({ required: true, unique: true })
  campaign_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  objective: string;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  budget_remaining: number;

  @Prop()
  daily_budget: number;
}

export const MetaCampaignSchema = SchemaFactory.createForClass(MetaCampaign);

MetaCampaignSchema.index({ ad_account_id: 1, company_id: 1 });
MetaCampaignSchema.index({ campaign_id: 1, ad_account_id: 1 });
