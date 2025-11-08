import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

@Schema({ _id: false })
class Metadata {
  @Prop()
  userAgent: string;
  @Prop()
  ipAddress: string;
  @Prop()
  sessionId: string;
}
const MetadataSchema = SchemaFactory.createForClass(Metadata);

@Schema({ timestamps: true })
export class UserShopSelection extends Document {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  shopDomain: string;

  @Prop({ default: Date.now })
  selectedAt: Date;

  @Prop({
    type: String,
    enum: ['manual', 'oauth_callback', 'auto'],
    default: 'manual',
  })
  selectionSource: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MetadataSchema, required: false })
  metadata: Metadata;
}

export interface UserShopSelectionModel extends Model<UserShopSelection> {
    setUserSelection(userId: string, shopDomain: string, source?: string, metadata?: object): Promise<UserShopSelection>;
    getUserSelection(userId: string): Promise<UserShopSelection | null>;
    clearUserSelection(userId: string): Promise<UserShopSelection | null>;
    getUsersByShop(shopDomain: string): Promise<UserShopSelection[]>;
}


export const UserShopSelectionSchema = SchemaFactory.createForClass(UserShopSelection);

UserShopSelectionSchema.statics.setUserSelection = async function (
  this: UserShopSelectionModel,
  userId: string,
  shopDomain: string,
  source = 'manual',
  metadata = {},
) {
  try {
    const result = await this.findOneAndUpdate(
      { userId },
      {
        shopDomain,
        selectedAt: new Date(),
        selectionSource: source,
        isActive: true,
        metadata,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to set user selection: ${error.message}`);
  }
};

UserShopSelectionSchema.statics.getUserSelection = async function (this: UserShopSelectionModel, userId: string) {
  try {
    return await this.findOne({ userId, isActive: true });
  } catch (error) {
    throw new Error(`Failed to get user selection: ${error.message}`);
  }
};

UserShopSelectionSchema.statics.clearUserSelection = async function (this: UserShopSelectionModel, userId: string) {
  try {
    return await this.findOneAndUpdate(
      { userId },
      { isActive: false },
      { new: true },
    );
  } catch (error) {
    throw new Error(`Failed to clear user selection: ${error.message}`);
  }
};

UserShopSelectionSchema.statics.getUsersByShop = async function (this: UserShopSelectionModel, shopDomain: string) {
  try {
    return await this.find({ shopDomain, isActive: true }).select('userId selectedAt');
  } catch (error) {
    throw new Error(`Failed to get users by shop: ${error.message}`);
  }
};

UserShopSelectionSchema.index({ userId: 1, isActive: 1 });
