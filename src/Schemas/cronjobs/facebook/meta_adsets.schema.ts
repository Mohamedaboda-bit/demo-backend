import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class GeoLocations {
  @Prop([String])
  countries: string[];

  @Prop([{ key: String, name: String }])
  regions: { key: string, name: string }[];

  @Prop([{ key: String, name: String, radius: Number, distance_unit: String }])
  cities: { key: string, name: string, radius: number, distance_unit: string }[];
}
const GeoLocationsSchema = SchemaFactory.createForClass(GeoLocations);

@Schema({ _id: false })
class TargetingAudience {
  @Prop()
  id: string;
  @Prop()
  name: string;
}
const TargetingAudienceSchema = SchemaFactory.createForClass(TargetingAudience);

@Schema({ _id: false })
class Targeting {
  @Prop()
  age_min: number;
  @Prop()
  age_max: number;
  @Prop([Number])
  genders: number[];
  @Prop({ type: GeoLocationsSchema })
  geo_locations: GeoLocations;
  @Prop({ type: [TargetingAudienceSchema] })
  interests: TargetingAudience[];
  @Prop({ type: [TargetingAudienceSchema] })
  behaviors: TargetingAudience[];
  @Prop({ type: [TargetingAudienceSchema] })
  custom_audiences: TargetingAudience[];
  @Prop({ type: [TargetingAudienceSchema] })
  lookalike_audiences: TargetingAudience[];
  @Prop([String])
  languages: string[];
  @Prop([String])
  devices: string[];
  @Prop([String])
  placements: string[];
}
const TargetingSchema = SchemaFactory.createForClass(Targeting);

@Schema({ 
    timestamps: { createdAt: 'created_at' },
    collection: 'meta_adsets',
})
export class MetaAdSet extends Document {
  @Prop({ required: true, unique: true })
  adset_id: string;

  @Prop()
  ad_account_id: string;

  @Prop()
  company_id: string;

  @Prop()
  campaign_id: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  bid_strategy: string;

  @Prop()
  budget_remaining: number;

  @Prop()
  optimization_goal: string;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  date: Date;
  
  @Prop({ type: TargetingSchema })
  targeting: Targeting;
}

export const MetaAdSetSchema = SchemaFactory.createForClass(MetaAdSet);

MetaAdSetSchema.index({ ad_account_id: 1, company_id: 1 });
MetaAdSetSchema.index({ adset_id: 1, ad_account_id: 1 });
