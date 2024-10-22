import { BaseDto } from "@/dto/base.dto.ts";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";
import { UserAddressDto } from "@/dto/user/address/user-address.dto.ts";

export interface UserDto extends BaseDto {
  email: string;
  avatarUrl: string | null;
  cart: CartItemDto[];
  addresses?: UserAddressDto[] | null;
}
