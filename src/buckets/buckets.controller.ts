import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseStatus } from 'src/interface/response.interface';
import { SerializerInterceptor } from 'src/interface/serializer.interceptor';
import { ObjectResponseDto } from 'src/objects/dto/object-response-dto';
import { ObjectsService } from 'src/objects/objects.service';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { BucketsService } from './buckets.service';
import { BucketResponseDto } from './dto/bucket-response.dto';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { CreateObjectsDto, FilterObjects } from './dto/create-objects.dto';
import { Response } from 'express';

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

  @Get(':bucketName/objects/:key')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To Get Single Object from the bucket',
  })
  @UseInterceptors(new SerializerInterceptor(ObjectResponseDto))
  @ApiTags('Objects')
  async getObjects(
    @Param('bucketName') bucketName: string,
    @Param('key') key: string,
    @Req() req,
    @Res() response: Response,
  ) {
    const bucket = await this.bucketsService.findOneBucket({
      name: bucketName,
    });
    if (!bucket) {
      throw new HttpException('Bucket not found', 404);
    }

    const object = await this.objectService.findOne(req.user._id, key);
    if (!object) {
      throw new HttpException('Object not found', 404);
    }

    response.download(object.meta.path);
  }
}
