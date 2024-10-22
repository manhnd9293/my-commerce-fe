import { BaseDto } from "@/dto/base.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

export interface UserAddressDto extends BaseDto {
  userId: number;

  user?: UserDto;

  province: string;

  district: string;

  commune: string;

  noAndStreet: string;

  name: string;
}
