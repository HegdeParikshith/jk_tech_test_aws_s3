import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { BucketsService } from './buckets.service';
import { SerializerInterceptor } from 'src/interface/serializer.interceptor';
import { BucketResponseDto } from './dto/bucket-response.dto';

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
  async getBucket(@Req() req) {
    const buckets = await this.bucketsService.getBuckets(req.user._id);
    return {
      success: true,
      buckets: buckets,
      owner: req.user,
    };
  }
}
