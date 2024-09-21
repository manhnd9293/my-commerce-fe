import { BaseDto } from '@/dto/base.dto.ts';
import { Product } from '@/dto/product/product.ts';

export interface ProductSize extends BaseDto {
  name: string;
  productId: number;
  product: Product;
}
