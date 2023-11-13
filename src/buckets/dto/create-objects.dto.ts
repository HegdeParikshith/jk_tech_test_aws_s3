import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { S3_ACL } from '../../utils';

export class CreateObjectsDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  @IsEnum(S3_ACL)
  access: string;

  created_by?: string;
}

export class FilterObjects {
  @ApiPropertyOptional({
    description:
      'Limits the response to keys that begin with the specified prefix',
  })
  @IsString()
  @IsOptional()
  prefix: string;

  @ApiPropertyOptional({
    description:
      'Sets the maximum number of keys returned in the response. By default, the action returns up to 1,000 key names. The response might contain fewer keys but will never contain more',
  })
  @IsNumberString()
  @IsOptional()
  maxKeys: string;
}
