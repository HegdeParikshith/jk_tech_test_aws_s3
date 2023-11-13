import { Expose, Transform, Type } from 'class-transformer';

export class OwnerDto {
  @Expose()
  name: string;

  @Expose()
  id: string;
}
export class ObjectsDto {
  @Expose()
  id: string;

  @Expose()
  key: string;

  @Expose()
  updatedAt?: Date;

  @Expose()
  @Type(() => OwnerDto)
  created_by: OwnerDto;

  @Expose()
  @Transform(({ obj }) => obj.meta.size)
  size: number;
}

export class ObjectResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  @Type(() => ObjectsDto)
  objects: ObjectsDto;

  @Expose()
  message: string;
}
