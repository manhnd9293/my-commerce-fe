import httpClient from "@/http-client/http-client.ts";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";

class CartService {
  async addCartItem(data: CreateCartItemDto): Promise<CartItemDto> {
    return httpClient.put(`/carts/add`, data);
  }

  async removeCartItem(id: number): Promise<string> {
    return httpClient.delete(`/carts/item/${id}`);
  }
}

export default new CartService();

export interface CreateCartItemDto {
  productVariantId: number;
  quantity: number;
}
