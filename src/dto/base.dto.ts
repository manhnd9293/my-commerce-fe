import { UserDto } from "@/dto/user/user.dto.ts";

export interface BaseDto {
  id?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  createdById?: number | null;
  createdByUser?: UserDto | null;
}
