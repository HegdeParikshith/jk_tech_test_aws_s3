import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketsModule } from './buckets/buckets.module';
import { ObjectsModule } from './objects/objects.module';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://parikshithhegde04:NtDRW3EMCObHS4q3@cluster0.cvevuzs.mongodb.net/?retryWrites=true&w=majority',
    ),
    BucketsModule,
    ObjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
