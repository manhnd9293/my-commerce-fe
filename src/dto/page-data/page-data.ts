export interface PageData<T> {
  data: T[];
  page: number;
  totalPage: number;
  pageSize: number;
}
