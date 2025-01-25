import { ConversationStatus } from "@/dto/conversations/conversation.dto.ts";

export interface UpdateConversationStatusDto {
  status: ConversationStatus;
}
