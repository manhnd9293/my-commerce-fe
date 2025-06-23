import { Paperclip, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { UserState } from "@/store/user/userSlice.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import ConversationsService from "@/services/conversations.service.ts";
import { MessageDto } from "@/dto/conversations/message.dto.ts";
import { socket } from "@/pages/layout/RootLayout.tsx";
import { ConversationStatus } from "@/dto/conversations/conversation.dto.ts";
import { BaseDto } from "@/dto/base.dto.ts";
import { ConversationEvent } from "@/dto/conversations/conversation-event.ts";
import { flushSync } from "react-dom";
import { UpdateConversationPayloadDto } from "@/dto/conversations/update-conversation-payload.dto.ts";
import { ConversationAction } from "@/dto/conversations/conversation-action.ts";

interface ChatBoxProps {
  conversationId: BaseDto["id"];
  onConversationEnd: () => void;
}

function ChatBox({ conversationId, onConversationEnd }: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const currentUser: UserState = useSelector((state: RootState) => state.user);

  const { data: oldMessages } = useQuery({
    queryKey: ["conversation_messages", conversationId],
    queryFn: () => ConversationsService.getConversationMessages(conversationId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data: conversationDetail, refetch: refetchConversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => ConversationsService.getConversationDetail(conversationId),
  });

  useEffect(() => {
    if (chatInputRef?.current) {
      chatInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function appendMessages(data: MessageDto) {
      setMessages((m) => m.concat(data));
    }

    function onConversationUpdate(payload: UpdateConversationPayloadDto) {
      if (payload.type === ConversationAction.Take) {
        return refetchConversation();
      } else if (payload.type === ConversationAction.End) {
        onConversationEnd();
      }
    }

    socket.on(ConversationEvent.NewMessage, appendMessages);
    socket.on(ConversationEvent.Update, onConversationUpdate);

    return () => {
      socket.off(ConversationEvent.NewMessage, appendMessages);
      socket.off(ConversationEvent.Update, onConversationUpdate);
    };
  }, []);

  useEffect(() => {
    conversationId &&
      socket.emit(ConversationEvent.EnterConversation, "" + conversationId);

    return () => {
      conversationId &&
        socket.emit(ConversationEvent.LeaveConversation, "" + conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    if (
      !oldMessages ||
      oldMessages.length === 0 ||
      !messageContainerRef.current?.lastChild
    ) {
      return;
    }
    messageContainerRef.current?.lastChild.scrollIntoView({
      block: "start",
    });
  }, [oldMessages]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !socket.connected || !chatInput) {
      return;
    }

    socket.emit(
      ConversationEvent.CreateMessage,
      {
        textContent: chatInput,
        conversationId,
      },
      (data: MessageDto) => {
        flushSync(() => {
          setMessages((messages) => messages.concat(data));
        });
        messageContainerRef.current!.lastChild!.scrollIntoView({
          block: "start",
        });
      },
    );

    setChatInput("");
  }

  const allMessages: MessageDto[] = [...(oldMessages || []), ...messages];
  return (
    <>
      <div
        ref={messageContainerRef}
        className={`flex-1 rounded-md bg-gray-50 flex flex-col gap-2 p-4 overflow-y-scroll`}
      >
        {allMessages &&
          allMessages.map((mess, index) => {
            const showAvatar =
              index === 0 ||
              Number(allMessages[index - 1].createdById) !==
                Number(mess.createdById);
            const fromCurrentUser = Number(mess.createdById) === currentUser.id;
            const avatarUrl = fromCurrentUser
              ? currentUser.avatarUrl
              : conversationDetail?.takenUser?.avatarUrl;
            return (
              <div
                key={mess.id}
                className={`flex items-start gap-2 ${fromCurrentUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={"w-8 h-8 shrink-0"}>
                  {showAvatar && (
                    <img
                      className={
                        "object-center object-cover w-full h-full rounded-full"
                      }
                      src={avatarUrl!}
                    />
                  )}
                </div>
                <div
                  className={`px-2 py-1 ${fromCurrentUser ? "bg-purple-700 text-white" : "bg-gray-200 text-black"} rounded-md max-w-[60%] overflow-hidden overflow-ellipsis`}
                >
                  {mess.textContent}
                </div>
              </div>
            );
          })}
        {conversationDetail?.status === ConversationStatus.Pending && (
          <div>
            Please wait for few minutes, our agents is going to take your chat
            ...{" "}
          </div>
        )}
      </div>
      <div className={"w-full h-[1px] bg-gray-300"}></div>
      <div className={"flex justify-center items-center bg-white"}>
        <div
          className={
            "size-10 flex items-center justify-center text-gray-500 p-2 cursor-pointer"
          }
        >
          <Paperclip className={"size-5"} />
        </div>
        <input
          className={
            "h-12 rounded-lg border-gray-50 focus:outline-0 px-1 py-2 w-full flex-1"
          }
          type={"text"}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={"Type a messages ... "}
          ref={chatInputRef}
          onKeyDown={handleKeyDown}
        />
        <div
          className={
            "size-12 flex items-center justify-center p-2 cursor-pointer"
          }
        >
          <div
            className={cn(
              "rounded-full bg-gray-300 size-8 flex justify-center items-center text-amber-50",
              {
                "bg-green-700": chatInput.length > 0,
              },
            )}
          >
            <SendHorizonal className={"size-5"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
