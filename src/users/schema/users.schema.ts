import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, index: 'text' })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ select: false })
  @ExcludeProperty()
  password: string;

  @Prop({ index: 'text' })
  phone_number: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
