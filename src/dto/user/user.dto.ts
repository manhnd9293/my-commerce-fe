import { BaseDto } from "@/dto/base.dto.ts";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";

export interface UserDto extends BaseDto {
  email: string;
  cart: CartItemDto[];
}
