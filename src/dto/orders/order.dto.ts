import { BaseDto } from "@/dto/base.dto.ts";
import { OrderItem } from "@/dto/orders/order-item.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

export interface OrderDto extends BaseDto {
  userId: number;

  user: UserDto;

  total: number;

  orderItems: OrderItem[];

  customerName: string;

  phone: string;

  province: string;

  district: string;

  commune: string;

  noAndStreet: string;
}
