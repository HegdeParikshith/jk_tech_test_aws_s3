import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import { User } from '../../users/schema/users.schema';
import { BucketRegex, S3_ACL, S3Region } from '../../utils';

export type BucketDocument = Bucket & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Bucket {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    required: true,
    index: 'text',
    minlength: 3,
    maxlength: 63,
    unique: true,
    match: BucketRegex,
  })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  created_by: User;

  @Prop({ enum: S3_ACL })
  access: string;

  @Prop({ enum: S3Region })
  location: string;
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
BucketSchema.index(
  {
    name: 1,
    created_by: 1,
  },
  { unique: true },
);
