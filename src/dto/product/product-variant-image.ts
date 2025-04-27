import { BaseDto } from "@/dto/base.dto.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { Asset } from "@/dto/asset.ts";

export interface ProductVariantImage extends BaseDto {
  assetId: string;
  productVariantId: string;
  asset: Asset;
  productVariant: ProductVariant;
}
