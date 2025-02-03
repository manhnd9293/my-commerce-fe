import httpClient from "@/http-client/http-client.ts";
import { MessageDto } from "@/dto/conversations/message.dto.ts";
import {
  ConversationDto,
  ConversationStatus,
} from "@/dto/conversations/conversation.dto.ts";
import { UpdateConversationStatusDto } from "@/dto/conversations/update-conversation-status.dto.ts";

class QueryConversationDto {
  status?: ConversationStatus;
}

class ConversationsService {
  getConversationMessages(conversationId: number): Promise<MessageDto[]> {
    return httpClient.get(`/conversations/${conversationId}/messages`);
  }

  getConversations(query: QueryConversationDto): Promise<ConversationDto[]> {
    const queryString = Object.keys(query)
      // @ts-ignore
      .map((key) => `${key}=${query[key]}`)
      .join("&");
    return httpClient.get(`/conversations?${queryString}`);
  }

  getConversationDetail(id: number): Promise<ConversationDto> {
    return httpClient.get(`/conversations/${id}`);
  }

  getCurrentConversation(): Promise<ConversationDto> {
    return httpClient.get(`/conversations/current`);
  }

  updateStatus(
    id: number,
    data: UpdateConversationStatusDto,
  ): Promise<ConversationDto> {
    return httpClient.patch(`/conversations/${id}/status`, data);
  }

  createConversation(data: { subject: string; message: string }) {
    return httpClient.post("/conversations", {
      subject: data.subject,
      message: data.message,
    });
  }
}

export default new ConversationsService();
