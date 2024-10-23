import { UserDto } from "@/dto/user/user.dto.ts";

export interface UpdateUserGeneralInfoDto
  extends Partial<Pick<UserDto, "fullName" | "dob" | "phone">> {}
