import { ConversationDto } from "@/dto/conversations/conversation.dto.ts";
import { ConversationAction } from "@/dto/conversations/conversation-action.ts";

export interface UpdateConversationPayloadDto {
  data: ConversationDto;
  type: ConversationAction;
}
