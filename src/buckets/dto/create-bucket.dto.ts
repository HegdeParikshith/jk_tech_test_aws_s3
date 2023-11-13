import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { BucketRegex, S3Region, S3_ACL } from 'src/utils';

export class CreateBucketDto {
  @ApiProperty()
  @IsString()
  @Matches(BucketRegex)
  name: string;

  @ApiProperty()
  @IsString()
  @IsEnum(S3_ACL)
  access: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(S3Region)
  location: string;

  created_by?: string;
}
