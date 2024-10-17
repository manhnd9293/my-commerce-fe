import { SignInDto } from "@/dto/auth/sign-in.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import { OrderItem } from "@/dto/orders/order-item.ts";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";
import Utils from "@/utils/utils.ts";

class UsersService {
  signUp(signInDto: SignInDto) {
    return httpClient.post("/users", signInDto);
  }

  me() {
    return httpClient.get("/users/me");
  }

  uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.patch("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteAvatar(): Promise<string> {
    return httpClient.delete("/users/avatar");
  }

  getPurchaseHistory(queryData: BaseQueryDto): Promise<PageData<OrderItem>> {
    const queryParamsString = Utils.getQueryParams(queryData);
    return httpClient.get(`/users/my-purchase?${queryParamsString}`);
  }
}

export default new UsersService();
