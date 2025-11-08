import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class ShopData {
    @Prop()
    id: number;
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    domain: string;
    @Prop()
    currencyCode: string;
    @Prop()
    timezone: string;
    @Prop()
    planName: string;
    @Prop()
    planDisplayName: string;
}
const ShopDataSchema = SchemaFactory.createForClass(ShopData);

@Schema({ _id: false })
class Webhook {
    @Prop()
    id: string;
    @Prop()
    topic: string;
    @Prop()
    address: string;
    @Prop()
    createdAt: Date;
}
const WebhookSchema = SchemaFactory.createForClass(Webhook);

@Schema({ collection: 'shops', timestamps: true })
export class Shop extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, unique: true, index: true })
    shopDomain: string;
    
    @Prop({ required: true })
    accessToken: string;

    @Prop({ type: ShopDataSchema })
    shopData: ShopData;

    @Prop([String])
    scopes: string[];

    @Prop({ default: Date.now })
    installedAt: Date;

    @Prop({ default: true })
    isActive: boolean;
    
    @Prop()
    lastSyncAt: Date;

    @Prop({ type: [WebhookSchema] })
    webhooks: Webhook[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
