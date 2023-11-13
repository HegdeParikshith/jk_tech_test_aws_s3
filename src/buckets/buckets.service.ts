import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { S3Region, S3_ACL } from '../utils';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { Bucket, BucketDocument } from './schema/buckets.schema';

@Injectable()
export class BucketsService implements OnModuleInit {
  constructor(
    @InjectModel(Bucket.name) private bucketModel: Model<BucketDocument>,
    private readonly userServcie: UsersService,
  ) {}
  async onModuleInit() {
    const is_bucket = await this.bucketModel.findOne();
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

  async findOneBucket(params) {
    return await this.bucketModel.findOne({ ...params });
  }

  async createBucket(params: CreateBucketDto): Promise<Bucket> {
    try {
      return await this.bucketModel.create({ ...params });
    } catch (error) {
      console.error(error);
      if (error.code === 1100) {
        throw new HttpException('Duplicate bucket', 409);
      }
      throw new HttpException('Error while creating bucket', 400);
    }
  }

  async getBuckets(userId: string): Promise<Bucket[]> {
    return await this.bucketModel
      .find({ created_by: userId })
      .populate('created_by');
  }
}
