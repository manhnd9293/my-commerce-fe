import { CreateOrderItemDto } from "./create-order-item.dto";
import { OrderDto } from "@/dto/orders/order.dto.ts";

export interface CreateOrderDto
  extends Pick<
    OrderDto,
    | "customerName"
    | "phone"
    | "province"
    | "district"
    | "commune"
    | "noAndStreet"
  > {
  orderItems: CreateOrderItemDto[];
}
