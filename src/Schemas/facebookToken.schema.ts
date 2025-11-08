import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

@Schema({ _id: false })
class LastError {
  @Prop()
  message: string;

  @Prop()
  timestamp: Date;

  @Prop()
  code: string;
}

const LastErrorSchema = SchemaFactory.createForClass(LastError);

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: Record<string, any>) => {
      delete ret.accessToken;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  }
})
export class FacebookToken extends Document {
  @Prop({ required: true, index: true })
  adAccountId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: false })
  adAccountName: string;

  @Prop({ required: false })
  businessName: string;

  @Prop({ required: true, select: false })
  accessToken: string;

  @Prop({ default: 'user_access_token' })
  tokenType: string;

  @Prop({ required: false, index: true })
  expiresAt: Date;

  @Prop([String])
  scopes: string[];

  @Prop({ required: false, index: true, unique: true })
  facebookUserId: string;

  @Prop({ required: false })
  facebookUserName: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ required: false })
  lastSyncAt: Date;

  @Prop({
    type: String,
    enum: ['pending', 'syncing', 'completed', 'failed'],
    default: 'pending',
  })
  syncStatus: string;

  @Prop({ default: 0 })
  errorCount: number;

  @Prop({ type: LastErrorSchema, required: false })
  lastError?: LastError;

  @Prop({ default: false })
  dataPulled: boolean;

  isExpired: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  needsRefresh(): boolean {
    if (!this.expiresAt) return false;
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return this.expiresAt < sevenDaysFromNow;
  }

  async recordError(error: { message: string; code?: string }): Promise<this> {
    this.errorCount += 1;
    this.lastError = {
      message: error.message,
      timestamp: new Date(),
      code: error.code || 'UNKNOWN',
    };

    if (this.errorCount >= 5) {
      this.isActive = false;
    }

    return this.save();
  }

  async resetErrors(): Promise<this> {
    this.errorCount = 0;
    this.lastError = undefined;
    this.isActive = true;
    return this.save();
  }
  
  async getWithToken(): Promise<this | null> {
    return (this.constructor as Model<this>).findById(this._id).select('+accessToken').exec();
  }
}

export const FacebookTokenSchema = SchemaFactory.createForClass(FacebookToken);

FacebookTokenSchema.virtual('isExpired').get(function () {
  return this.expiresAt ? this.expiresAt < new Date() : false;
});

FacebookTokenSchema.pre('init', function (this: FacebookToken, next: (err?: Error) => void) {
  if (this.createdAt && typeof this.createdAt === 'object') {
      (this as any).createdAt = new Date((this.createdAt as any).$date);
  }
  if (this.updatedAt && typeof this.updatedAt === 'object') {
    (this as any).updatedAt = new Date((this.updatedAt as any).$date);
  }
  if (this.expiresAt && typeof this.expiresAt === 'object') {
    (this as any).expiresAt = new Date((this.expiresAt as any).$date);
  }
  next();
});

FacebookTokenSchema.statics.findActive = function () {
  return this.find({
    isActive: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  });
};

FacebookTokenSchema.statics.findExpired = function () {
  return this.find({
    expiresAt: { $lt: new Date() },
    isActive: true,
  });
};

FacebookTokenSchema.index({ adAccountId: 1, isActive: 1 });
FacebookTokenSchema.index({ expiresAt: 1 });
