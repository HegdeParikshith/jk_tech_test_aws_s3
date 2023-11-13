import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketsModule } from './buckets/buckets.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/s3'),
    BucketsModule,
    ObjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
