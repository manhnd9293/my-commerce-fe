import { BaseDto } from "@/dto/base.dto.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

export interface CartItemDto extends BaseDto {
  userId: number;

  user: UserDto;

  productVariantId: number;

  productVariant: ProductVariant;

  quantity: number;

  isCheckedOut: boolean;
}