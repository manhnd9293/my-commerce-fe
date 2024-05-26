import { Product } from '@/dto/product/product.ts';

export interface CreateProductDto extends Pick<Product, "name" | "categoryId"| "description">{
  productSizes: [],
  productColors: [],
  newImages: FileList
}