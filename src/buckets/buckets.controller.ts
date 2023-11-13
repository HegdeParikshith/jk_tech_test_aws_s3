import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseStatus } from 'src/interface/response.interface';
import { SerializerInterceptor } from 'src/interface/serializer.interceptor';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { BucketsService } from './buckets.service';
import { BucketResponseDto } from './dto/bucket-response.dto';
import { CreateBucketDto } from './dto/create-bucket.dto';

@Controller('buckets')
export class BucketsController {
  constructor(private readonly bucketsService: BucketsService) {}

  @Get()
  @ApiTags('Bucket')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To List Buckets',
  })
  @UseInterceptors(new SerializerInterceptor(BucketResponseDto))
  async getBucket(@Req() req): Promise<ResponseStatus> {
    const buckets = await this.bucketsService.getBuckets(req.user._id);
    return {
      success: true,
      buckets: buckets,
      owner: req.user,
    };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To List Buckets',
  })
  @UseInterceptors(new SerializerInterceptor(BucketResponseDto))
  async createBucket(@Body() params: CreateBucketDto, @Req() req) {
    params.created_by = req.user._id;
    const bucket = await this.bucketsService.createBucket(params);

    return {
      success: true,
      bucket,
    };
  }
}
