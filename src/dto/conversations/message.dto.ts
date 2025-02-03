import { BaseDto } from "@/dto/base.dto.ts";
import { ConversationDto } from "@/dto/conversations/conversation.dto.ts";

export interface MessageDto extends BaseDto {
  conversationId: number;
  textContent: string;

  conversation: ConversationDto;
}
