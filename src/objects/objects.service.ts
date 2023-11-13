import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BucketObject, BucketObjectDocument } from './schema/objects.schema';
import { Model } from 'mongoose';
import { FilterObjects } from 'src/buckets/dto/create-objects.dto';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(BucketObject.name)
    private objectModel: Model<BucketObjectDocument>,
  ) {}

  async createObjects(params) {
    try {
      return await this.objectModel.create({ ...params });
    } catch (error) {
      console.error(error);
    }
  }

  async getObjects(bucketId, filetrs: FilterObjects) {
    let filter;
    filetrs.prefix
      ? (filter = {
          key: { $regex: filetrs?.prefix, options: 'i' },
          bucket: bucketId,
        })
      : {
          bucket: bucketId,
        };
    return await this.objectModel
      .find({
        ...filter,
      })
      .limit(parseInt(filetrs.maxKeys) || 1000);
  }
}
