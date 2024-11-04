import { CreateOrderDto } from "@/dto/orders/create-order.dto.ts";
import { OrderDto } from "@/dto/orders/order.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";

export interface OrderCreateParams {
  data: CreateOrderDto;
  authUser: boolean;
}

class OrdersService {
  create({ data, authUser }: OrderCreateParams): Promise<OrderDto> {
    return httpClient.post(`/orders${!authUser ? "/no-auth" : ""}`, data);
  }

  getOrders(data: OrderQueryDto): Promise<PageData<OrderDto>> {
    const { pageSize, page, search, order, sortBy, userId } = data;
    const arr = [];
    search && arr.push(`search=${search}`);
    page && arr.push(`page=${page}`);
    pageSize && arr.push(`pageSize=${pageSize}`);
    order && arr.push(`order=${order}`);
    sortBy && arr.push(`sortBy=${sortBy}`);
    userId && arr.push(`userId=${userId}`);
    return httpClient.get(`/orders?${arr.join("&")}`);
  }

  getOrderDetail(orderId: number): Promise<OrderDto> {
    return httpClient.get(`/orders/${orderId}`);
  }
}

export default new OrdersService();
