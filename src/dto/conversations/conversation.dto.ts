import { BaseDto } from "@/dto/base.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";
import { MessageDto } from "@/dto/conversations/message.dto.ts";

export interface ConversationDto extends BaseDto {
  subject: string;

  status: ConversationStatus;

  takenById: number | null;

  takenUser: UserDto | null;

  messages?: MessageDto[];
}

export enum ConversationStatus {
  Pending = "pending",
  OnGoing = "on-going",
  End = "end",
}
