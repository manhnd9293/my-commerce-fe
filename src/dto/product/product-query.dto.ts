import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";

export class ProductQueryDto extends BaseQueryDto {
  categoryId?: number | string;
}
