import httpClient from "@/http-client/http-client.ts";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";
import { CartCheckOutUpdateDto } from "@/dto/cart/cart-check-out-update.dto.ts";

class CartService {
  async addCartItem(data: CreateCartItemDto): Promise<CartItemDto> {
    return httpClient.put(`/carts/add`, data);
  }

  async removeCartItem(id: number): Promise<string> {
    return httpClient.delete(`/carts/item/${id}`);
  }

  async updateCartItemCheckOut(
    data: CartCheckOutUpdateDto,
  ): Promise<CartItemDto> {
    return httpClient.patch(`/carts/item/check-out`, data);
  }
}

export default new CartService();

export interface CreateCartItemDto {
  productVariantId: number;
  quantity: number;
}
