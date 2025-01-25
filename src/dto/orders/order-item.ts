import { BaseDto } from "@/dto/base.dto.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { OrderDto } from "@/dto/orders/order.dto.ts";

export interface OrderItem extends BaseDto {
  productVariantId: number;

  productVariant: ProductVariant;

  quantity: number;

  unitPrice: number;

  orderId: number;

  order: OrderDto;
}
