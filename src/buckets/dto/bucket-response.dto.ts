import { Expose, Type } from 'class-transformer';

export class BucketDto {
  @Expose()
  createdAt: Date;
  @Expose()
  name: string;
}

export class OwnerDto {
  @Expose()
  name: string;

  @Expose()
  id: string;
}

export class BucketResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  @Type(() => BucketDto)
  buckets: BucketDto;

  @Expose()
  @Type(() => OwnerDto)
  owner: OwnerDto;
}
