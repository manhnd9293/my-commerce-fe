import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";

export class ProductRatingQueryDto extends BaseQueryDto {
  rate: number | undefined;
}
