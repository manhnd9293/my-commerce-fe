import { BaseDto } from '@/dto/base.dto.ts';
import { ProductColor } from '@/dto/product/product-color.ts';
import { ProductSize } from '@/dto/product/product-size.ts';
import { Product } from '@/dto/product/product.ts';
import { ProductVariantImage } from '@/dto/product/product-variant-image.ts';

export interface ProductVariant extends BaseDto {
  productId: number;

  product: Product;

  productSizeId: number;

  productSize: ProductSize;

  productColorId: number;

  productColor: ProductColor;

  images: ProductVariantImage[];

  quantity: number;
}
