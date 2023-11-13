import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, Types } from 'mongoose';
import { Bucket } from 'src/buckets/schema/buckets.schema';
import { User } from 'src/users/schema/users.schema';
import { S3_ACL } from 'src/utils';

export type BucketObjectDocument = BucketObject & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class BucketObject {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    required: true,
    index: 'text',
    minlength: 3,
    maxlength: 63,
    unique: true,
  })
  key: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  created_by: User;

  @Prop({ type: Types.ObjectId, ref: Bucket.name })
  bucket: Bucket;

  @Prop({ enum: S3_ACL })
  access: string;

  @Prop()
  meta: mongoose.Schema.Types.Mixed;
}

export const BucketObjectSchema = SchemaFactory.createForClass(BucketObject);
BucketObjectSchema.index(
  {
    key: 1,
    bucket: 1,
  },
  { unique: true },
);
