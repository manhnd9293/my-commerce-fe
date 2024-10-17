export class BaseQueryDto {
  search?: string | null = "";

  page?: number | null = 1;

  pageSize?: number | null = 10;

  order?: string | null = "ASC";

  sortBy?: string | null = "createdAt";
}
