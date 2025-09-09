import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  country!: string;

  @Prop({ required: true })
  accountType!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  contactNumber!: string;

  @Prop()
  photo?: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
