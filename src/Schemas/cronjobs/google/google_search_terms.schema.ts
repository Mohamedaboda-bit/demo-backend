import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'google_search_terms' })
export class GoogleSearchTerm extends Document {
  @Prop()
  adAccountId: string;

  @Prop()
  company_id: string;

  @Prop()
  search_term: string;

  @Prop()
  campaign_id: string;

  @Prop()
  ad_group_id: string;

  @Prop()
  impressions: number;

  @Prop()
  clicks: number;
  
  @Prop()
  ctr: number;

  @Prop()
  average_cpc: number;

  @Prop()
  conversions: number;

  @Prop()
  conversions_value: number;

  @Prop()
  cost_micros: number;

  @Prop()
  date: string;
}

export const GoogleSearchTermSchema = SchemaFactory.createForClass(GoogleSearchTerm);

GoogleSearchTermSchema.index({ search_term: 1, date: 1, company_id: 1 });
