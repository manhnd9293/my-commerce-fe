import { SignInDto } from "@/dto/auth/sign-in.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import { OrderItem } from "@/dto/orders/order-item.ts";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";
import Utils from "@/utils/utils.ts";
import { UserAddressDto } from "@/dto/user/address/user-address.dto.ts";
import { CreateUserAddressDto } from "@/dto/user/address/create-user-address.dto.ts";
import { UpdateUserAddressDto } from "@/dto/user/address/update-user-address.dto.ts";
import { UpdateUserGeneralInfoDto } from "@/dto/user/update-user-general-info.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

class UsersService {
  signUp(signInDto: SignInDto) {
    return httpClient.post("/users", signInDto);
  }

  me(): Promise<Partial<UserDto>> {
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

  addUserAddress(data: CreateUserAddressDto): Promise<UserAddressDto> {
    return httpClient.post(`/users/address`, data);
  }

  updateUserAddress(
    addressId: number,
    data: UpdateUserAddressDto,
  ): Promise<UserAddressDto> {
    return httpClient.put(`/users/address/${addressId}`, data);
  }

  deleteUserAddress(addressId: number) {
    return httpClient.delete(`/users/address/${addressId}`);
  }

  getUserAddresses(): Promise<UserAddressDto[]> {
    return httpClient.get("/users/address");
  }

  updateGeneralInfo(data: UpdateUserGeneralInfoDto): Promise<UserDto> {
    return httpClient.patch("/users/general-info", data);
  }
}

export default new UsersService();
