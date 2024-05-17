import { BaseDto } from '@/dto/base.dto.ts';

export interface Asset extends BaseDto {
  s3Key: string;
  fileType: string;
  size: number;
  url: string;
}