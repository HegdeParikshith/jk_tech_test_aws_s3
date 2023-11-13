import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketObject, BucketObjectSchema } from './schema/objects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BucketObject.name, schema: BucketObjectSchema },
    ]),
  ],
  providers: [ObjectsService],
  exports: [ObjectsService],
  controllers: [],
})
export class ObjectsModule {}
