import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseStatus } from 'src/interface/response.interface';
import { SerializerInterceptor } from 'src/interface/serializer.interceptor';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { BucketsService } from './buckets.service';
import { BucketResponseDto } from './dto/bucket-response.dto';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateObjectsDto, FilterObjects } from './dto/create-objects.dto';
import { Express } from 'express';
import { ObjectsService } from 'src/objects/objects.service';
import { ObjectResponseDto } from 'src/objects/dto/object-response-dto';

@Controller('buckets')
export class BucketsController {
  constructor(
    private readonly bucketsService: BucketsService,
    private readonly objectService: ObjectsService,
  ) {}

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
    summary: 'To Create Buckets',
  })
  @ApiTags('Bucket')
  @UseInterceptors(new SerializerInterceptor(BucketResponseDto))
  async createBucket(@Body() params: CreateBucketDto, @Req() req) {
    params.created_by = req.user._id;
    const bucket = await this.bucketsService.createBucket(params);

    return {
      success: true,
      bucket,
    };
  }

  @Put(':bucketName/objects')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To Create Buckets',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        key: {
          type: 'string',
        },
        access: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      dest: `./uploads/`,
    }),
  )
  @ApiTags('Objects')
  //   @UseInterceptors(new SerializerInterceptor(BucketResponseDto))
  async addObjects(
    @Param('bucketName') bucketName: string,
    @Body() params: CreateObjectsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const bucket = await this.bucketsService.findOneBucket({
      name: bucketName,
    });
    if (!bucket) {
      throw new NotFoundException('Bucket not found');
    }

    const bucketObjects = await this.objectService.createObjects({
      ...params,
      bucket: bucket._id,
      meta: file,
    });

    return bucketObjects;
  }

  @Get(':bucketName/objects')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To List Objects in the bucket',
  })
  @UseInterceptors(new SerializerInterceptor(ObjectResponseDto))
  @ApiTags('Objects')
  async listObjects(
    @Param('bucketName') bucketName: string,
    @Query() filter: FilterObjects,
  ) {
    const bucket = await this.bucketsService.findOneBucket({
      name: bucketName,
    });
    if (!bucket) {
      throw new NotFoundException('Bucket not found');
    }
    return {
      success: true,
      objects: await this.objectService.getObjects(bucket._id, filter),
    };
  }
}
