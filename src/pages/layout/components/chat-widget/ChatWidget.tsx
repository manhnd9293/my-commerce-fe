import { useState } from "react";
import { MessageCircle, XIcon } from "lucide-react";
import ChatBox from "@/pages/layout/components/chat-widget/ChatBox.tsx";
import InitConversation from "@/pages/layout/components/chat-widget/InitConversation.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ConversationsService from "@/services/conversations.service.ts";

function ChatWidget() {
  const [collapse, setCollapse] = useState(true);
  const queryClient = useQueryClient();

  const { data: currentConversation, refetch: refetchCurrentConversation } =
    useQuery({
      queryKey: ["conversation", "current"],
      queryFn: ConversationsService.getCurrentConversation,
    });

  async function onCreateConversation() {
    await queryClient.invalidateQueries({
      queryKey: ["conversation", "current"],
    });
    await refetchCurrentConversation();
  }

  async function onConversationEnd() {
    await queryClient.invalidateQueries({
      queryKey: ["conversation", "current"],
    });
    await refetchCurrentConversation();
  }

  const conversationId = currentConversation?.id;

  if (collapse) {
    return (
      <div
        className={
          "bg-amber-600 hover:bg-amber-500 w-[50px] h-[50px] rounded-full fixed bottom-5 right-12 flex justify-center items-center text-white cursor-pointer animate-wiggle shadow-md"
        }
        onClick={() => setCollapse(false)}
      >
        <MessageCircle />
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-5 right-12 w-[400px] h-[460px] bg-gray-100 flex flex-col rounded-lg border border-gray-300`}
    >
      <div
        className={
          "font-semibold h-12 items-center flex justify-between py-1 px-2"
        }
      >
        <span>Customer Support</span>
        <div
          className={
            "font-light rounded-full p-1 border border-gray-400 text-sm text-gray-600 cursor-pointer"
          }
          onClick={() => setCollapse(true)}
        >
          <XIcon className={"size-4 font-lights"} />
        </div>
      </div>
      <div className={"w-full h-[1px] bg-gray-300"}></div>

      {!conversationId && (
        <InitConversation onCreateConversation={onCreateConversation} />
      )}
      {conversationId && (
        <ChatBox
          conversationId={conversationId}
          onConversationEnd={onConversationEnd}
        />
      )}
    </div>
  );
}

export default ChatWidget;
