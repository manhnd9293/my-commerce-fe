import { BaseDto } from "@/dto/base.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

export interface CreateUserAddressDto extends BaseDto {
  province: string;

  district: string;

  commune: string;

  noAndStreet: string;
}
