import { Product } from "@/dto/product/product.ts";
import { UserDto } from "@/dto/user/user.dto.ts";
import { BaseDto } from "@/dto/base.dto.ts";
import { ProductRatingMediaDto } from "@/dto/product-rating/product-rating-media.dto.ts";

export interface ProductRatingDto extends BaseDto {
  productId: string;

  userId: string;

  user: UserDto;

  product: Product;

  textContent: string;

  rate: number;

  ratingMedia: ProductRatingMediaDto[];
}
