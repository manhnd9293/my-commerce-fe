import { BaseDto } from '@/dto/base.dto.ts';
import { Asset } from '@/dto/asset.ts';
import { Product } from '@/dto/product/product.ts';

export interface ProductImage extends BaseDto {
  productId: number;

  product?: Product;

  asset: Asset;

  assetId: number;
}