import { CreateOrderDto } from "@/dto/orders/create-order.dto.ts";
import { OrderDto } from "@/dto/orders/order.dto.ts";
import httpClient from "@/http-client/http-client.ts";

class OrdersService {
  create(data: CreateOrderDto): Promise<OrderDto> {
    return httpClient.post("/orders", data);
  }
}

export default new OrdersService();
