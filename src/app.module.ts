import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketsModule } from './buckets/buckets.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/s3'),
    BucketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
