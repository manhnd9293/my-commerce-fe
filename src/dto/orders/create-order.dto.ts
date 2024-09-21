import { CreateOrderItemDto } from "./create-order-item.dto";

export interface CreateOrderDto {
  orderItems: CreateOrderItemDto[];
}
