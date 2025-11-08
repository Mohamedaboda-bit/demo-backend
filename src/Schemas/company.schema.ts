import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Permission {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, default: false })
  access: boolean;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true, default: 'Brand' })
  companyType: string;

  @Prop({ type: [PermissionSchema], required: false })
  agency: Permission[];

  @Prop({ type: [PermissionSchema], required: false })
  brand: Permission[];

  @Prop({ required: false })
  code: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
