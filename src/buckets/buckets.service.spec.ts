import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { CreateBucketDto } from './dto/create-bucket.dto';

describe('BucketsService', () => {
  let bucketsService: BucketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BucketsService],
    }).compile();

    bucketsService = module.get<BucketsService>(BucketsService);
  });

  it('should be defined', () => {
    expect(bucketsService).toBeDefined();
  });

  describe('createBucket', () => {
    it('should create a bucket', async () => {
      const createBucketDto: CreateBucketDto = {
        name: 'test-bucket',
        access: 'public_read',
        location: 'AFSouth1',
        created_by: 'user_id',
      };

      const createdBucket = await bucketsService.createBucket(createBucketDto);

      expect(createdBucket).toBeDefined();
      expect(createdBucket.name).toBe('test-bucket');
    });

    it('should handle duplicate bucket names', async () => {
      // Simulate a scenario where a duplicate bucket name is being created
      const createBucketDto: CreateBucketDto = {
        name: 'test',
        access: 'public_read',
        location: 'AFSouth1',
        created_by: 'user_id',
      };

      try {
        await bucketsService.createBucket(createBucketDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(409);
      }
    });
  });

  // Add more test cases for other methods (e.g., findOneBucket, getBuckets)
});
