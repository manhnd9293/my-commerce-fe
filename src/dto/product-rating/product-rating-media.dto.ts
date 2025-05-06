import { Asset } from "@/dto/asset.ts";
import { ProductRatingDto } from "@/dto/product-rating/product-rating.dto.ts";
import { BaseDto } from "@/dto/base.dto.ts";

export interface ProductRatingMediaDto extends BaseDto {
  assetId: string;

  asset: Asset;

  productRatingId: string;

  productRating: ProductRatingDto;

  mediaUrl: string;
}
