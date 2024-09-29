import { CreateOrderDto } from "@/dto/orders/create-order.dto.ts";
import { OrderDto } from "@/dto/orders/order.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";

class OrdersService {
  create(data: CreateOrderDto): Promise<OrderDto> {
    return httpClient.post("/orders", data);
  }

  getOrders(data: OrderQueryDto): Promise<PageData<OrderDto>> {
    const { pageSize, page, search, order, sortBy, userId } = data;
    const queryString = "";
    const arr = [];
    search && arr.push(`search=${search}`);
    page && arr.push(`page=${page}`);
    pageSize && arr.push(`pageSize=${pageSize}`);
    order && arr.push(`order=${order}`);
    sortBy && arr.push(`sortBy=${sortBy}`);
    userId && arr.push(`userId=${userId}`);
    console.log({ queryString });
    return httpClient.get(`/orders?${arr.join("&")}`);
  }
}

export default new OrdersService();
