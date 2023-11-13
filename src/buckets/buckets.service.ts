import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket, BucketDocument } from './schema/buckets.schema';
import { Model } from 'mongoose';
import { S3Region, S3_ACL } from 'src/utils';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BucketsService implements OnModuleInit {
  constructor(
    @InjectModel(Bucket.name) private bucketModel: Model<BucketDocument>,
    private readonly userServcie: UsersService,
  ) {}
  async onModuleInit() {
    const is_bucket = await this.findOneBucket();
    if (!is_bucket) {
      const user = await this.userServcie.findOneUser();
      await this.createBucket({
        name: 'test',
        access: S3_ACL.public_read,
        location: S3Region.AFSouth1,
        created_by: user._id,
      });
    }
  }

  async findOneBucket() {
    return await this.bucketModel.findOne();
  }

  async createBucket(params) {
    return await this.bucketModel.create({ ...params });
  }

  async getBuckets(userId: string): Promise<Bucket[]> {
    console.info(userId);
    return await this.bucketModel
      .find({ created_by: userId })
      .populate('created_by');
  }
}
