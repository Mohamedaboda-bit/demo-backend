import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
    timestamps: { updatedAt: 'last_updated', createdAt: false },
    collection: 'conversions'
})
export class Conversion extends Document {
  @Prop({ required: true })
  company_id: string;

  @Prop({ required: true })
  customer_id: string;

  @Prop({ required: true })
  campaign_id: string;

  @Prop({ required: true })
  ad_group_id: string;

  @Prop({ required: true })
  ad_id: string;

  @Prop({ required: true })
  conversion_action: string;

  @Prop()
  conversion_value: number;

  @Prop()
  conversion_date: Date;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion);
