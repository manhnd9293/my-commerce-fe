import { useState } from "react";
import { AdminChatBox } from "@/pages/admin/admin-chat/AdminChatBox.tsx";
import { cn } from "@/lib/utils.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import conversationsService from "@/services/conversations.service.ts";
import {
  ConversationDto,
  ConversationStatus,
} from "@/dto/conversations/conversation.dto.ts";
import { adminSocket } from "@/pages/admin/layout/AdminLayout.tsx";
import { ConversationEvent } from "@/dto/conversations/conversation-event.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

const stateFilters: { label: string; value: ConversationStatus }[] = [
  {
    label: "Ongoing",
    value: ConversationStatus.OnGoing,
  },
  {
    label: "Pending",
    value: ConversationStatus.Pending,
  },
  {
    label: "Ended",
    value: ConversationStatus.End,
  },
];

function CustomerSupportChat() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<ConversationDto["id"]>(null);
  const [currentStateFilter, setCurrentStateFilter] = useState(
    ConversationStatus.OnGoing,
  );
  const queryClient = useQueryClient();

  const { data: conversations } = useQuery({
    queryKey: ["conversations", currentStateFilter],
    queryFn: () =>
      conversationsService.getConversations({ status: currentStateFilter }),
  });

  const selectedConversation = conversations?.find(
    (c) => c.id === selectedConversationId,
  );
  const currentCustomer = selectedConversation?.createdByUser;
  const currentStatus = selectedConversation?.status;

  async function onTakeChat(conversationId: number) {
    await conversationsService.updateStatus(conversationId as number, {
      status: ConversationStatus.OnGoing,
    });
    adminSocket.emit(ConversationEvent.EnterConversation, "" + conversationId);
    setCurrentStateFilter(ConversationStatus.OnGoing);
  }

  async function onEndChat(conversationId: number) {
    await conversationsService.updateStatus(conversationId as number, {
      status: ConversationStatus.End,
    });
    adminSocket.emit(ConversationEvent.LeaveConversation, "" + conversationId);
    setSelectedConversationId(null);
    queryClient.setQueryData(
      ["conversations", currentStateFilter],
      (data: ConversationDto[]) => data.filter((c) => c.id !== conversationId),
    );
  }

  return (
    <div>
      <h1 className={"text-2xl"}>Customer support chat</h1>
      <div
        className={
          "mt-4 flex w-[800px]  h-[550px] gap-2 border-solid rounded-md border-gray-600"
        }
      >
        <div
          className={
            "bg-white flex flex-col w-[300px] max-h-full rounded-md gap-2"
          }
        >
          <div
            className={"flex w-full px-2 gap-2 justify-center items-center p-4"}
          >
            {stateFilters.map((state) => {
              return (
                <div
                  key={state.value}
                  onClick={() => setCurrentStateFilter(state.value)}
                  className={cn(
                    "border-1 border-solid border-gray-600 rounded-xl py-1 px-2 cursor-pointer bg-gray-200 text-gray-500",
                    {
                      "bg-amber-600 text-white":
                        currentStateFilter === state.value,
                    },
                  )}
                >
                  {state.label}
                </div>
              );
            })}
          </div>
          <div
            className={
              "bg-white flex flex-col w-full max-h-full overflow-y-auto"
            }
          >
            {conversations &&
              conversations.map((con) => {
                const latestMessages =
                  con.messages && con.messages.length > 0
                    ? con.messages[0].textContent
                    : "";
                const clientAvatarUrl = con.createdByUser?.avatarUrl;
                return (
                  <div
                    className={cn(
                      "cursor-pointer py-1 px-2 flex items-center gap-4 bg-white w-full box-border",
                      {
                        "border-l-4 border-l-blue-500 bg-gray-100":
                          con.id === selectedConversationId,
                      },
                    )}
                    onClick={() => {
                      setSelectedConversationId(con.id);
                    }}
                    key={con.id}
                  >
                    <div className={"size-10 rounded-full"}>
                      <Avatar>
                        <AvatarImage src={clientAvatarUrl} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={"flex flex-col gap-2"}>
                      <div className={"font-semibold"}>
                        {con.createdByUser?.fullName || "Unnamed"}
                      </div>
                      <div className={"line-clamp-1"}>{latestMessages}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={"bg-white flex flex-col flex-1 rounded-md"}>
          {selectedConversationId && currentStatus === currentStateFilter && (
            <AdminChatBox
              conversationId={selectedConversationId}
              onTakeChat={onTakeChat}
              onEndChat={onEndChat}
              customer={currentCustomer}
              status={currentStatus}
              key={selectedConversationId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportChat;
