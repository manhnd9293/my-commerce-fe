import { BaseDto } from "@/dto/base.dto.ts";

export interface CreateUserAddressDto extends BaseDto {
  province: string;

  district: string;

  commune: string;

  noAndStreet: string;
}
