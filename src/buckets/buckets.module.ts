import { Module } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { BucketsController } from './buckets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bucket, BucketSchema } from './schema/buckets.schema';
import { UsersModule } from 'src/users/users.module';
import { ObjectsModule } from 'src/objects/objects.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bucket.name, schema: BucketSchema }]),
    UsersModule,
    ObjectsModule,
  ],
  providers: [BucketsService],
  controllers: [BucketsController],
})
export class BucketsModule {}
