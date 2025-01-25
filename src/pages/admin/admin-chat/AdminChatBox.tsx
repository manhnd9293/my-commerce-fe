import { UserState } from "@/store/user/userSlice.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ConversationsService from "@/services/conversations.service.ts";
import {
  ConversationDto,
  ConversationStatus,
} from "@/dto/conversations/conversation.dto.ts";
import { MessageDto } from "@/dto/conversations/message.dto.ts";
import { UserDto } from "@/dto/user/user.dto.ts";
import { Button } from "@/components/ui/button.tsx";
import { Plus, SendHorizonal, X } from "lucide-react";
import { adminSocket } from "@/pages/admin/layout/AdminLayout.tsx";
import { flushSync } from "react-dom";
import { ConversationEvent } from "@/dto/conversations/conversation-event.ts";

export interface AdminChatBoxProps {
  conversationId: ConversationDto["id"];
  customer?: UserDto | null;
  status?: ConversationStatus | null;
  onTakeChat: (id: number) => void;
  onEndChat: (id: number) => void;
}

export function AdminChatBox({
  conversationId,
  customer,
  status,
  onTakeChat,
  onEndChat,
}: AdminChatBoxProps) {
  const currentUser: UserState = useSelector((state: RootState) => state.user);
  const [realTimeMessages, setRealTimeMessages] = useState<MessageDto[]>([]);

  const [chatInput, setChatInput] = useState<string>("");
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLInputElement>(null);

  const { data: oldMessages } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => {
      if (typeof conversationId !== "number") {
        return [];
      }
      return ConversationsService.getConversationMessages(conversationId);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    function onNewMessage(data: MessageDto) {
      if (data.conversationId === conversationId) {
        setRealTimeMessages((ms) => [...ms, data]);
      }
    }

    adminSocket.on(ConversationEvent.NewMessage, onNewMessage);
    return () => {
      adminSocket.off(ConversationEvent.NewMessage, onNewMessage);
    };
  }, []);

  useEffect(() => {
    chatInputRef?.current && chatInputRef.current.focus();
    setRealTimeMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (!oldMessages) {
      return;
    }
    const messageContainerDomNode = messageContainerRef.current;
    const lastMessageDomNode: ChildNode | null | undefined =
      messageContainerDomNode?.lastChild;
    lastMessageDomNode &&
      lastMessageDomNode.scrollIntoView({
        block: "start",
      });
  }, [oldMessages]);

  function handleSendMessage(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return;
    }
    adminSocket.emit(
      ConversationEvent.CreateMessage,
      {
        textContent: chatInput,
        conversationId: conversationId,
      },
      (data: MessageDto) => {
        flushSync(() => {
          setRealTimeMessages((messages) => [...messages, data]);
        });

        messageContainerRef.current!.lastChild!.scrollIntoView({
          block: "start",
        });
      },
    );
    setChatInput("");
  }

  const allMessages = [...(oldMessages || []), ...realTimeMessages];
  return (
    <>
      {customer && (
        <div
          className={
            "flex justify-between items-center h-[80px] bg-white px-4 py-2 border-b-2 border-b-gray-200"
          }
        >
          <div className={"flex items-center gap-2"}>
            <div className={"size-10 rounded-full"}>
              {customer.avatarUrl && (
                <img
                  className={"size-full rounded-full"}
                  src={customer.avatarUrl}
                />
              )}
            </div>
            <div>
              <div className={"font-semibold text-sm"}>
                {customer.fullName || "Unnamed"}
              </div>
              <div className={"text-gray-500 text-sm"}>{customer.email}</div>
            </div>
          </div>
          <div>
            {status === ConversationStatus.Pending && (
              <Button
                size={"sm"}
                className={
                  "flex justify-center items-center bg-amber-600 hover:bg-amber-500 gap-1"
                }
                onClick={() => onTakeChat(conversationId as number)}
              >
                <Plus className={"size-5"} />
                <span>Take chat</span>
              </Button>
            )}
            {status === ConversationStatus.OnGoing && (
              <Button
                size={"sm"}
                className={
                  "flex justify-center items-center bg-amber-600 hover:bg-amber-500 gap-1"
                }
                onClick={() => onEndChat(conversationId as number)}
              >
                <X className={"size-5"} />
                <span>End chat</span>
              </Button>
            )}
          </div>
        </div>
      )}
      <div
        className={"flex-1 overflow-y-auto p-4 flex flex-col gap-2"}
        ref={messageContainerRef}
      >
        {allMessages &&
          allMessages.map((mess) => {
            const fromCurrentUser =
              Number(mess.createdById) === Number(currentUser.id);
            const justifyProp = fromCurrentUser
              ? "justify-end"
              : "justify-start";
            const textProps = fromCurrentUser
              ? "bg-purple-700 text-white"
              : "bg-gray-200 text-black";
            return (
              <div key={mess.id} className={`flex gap-2 ${justifyProp}`}>
                <div
                  className={`px-2 py-1 rounded-md max-w-[75%] overflow-hidden overflow-ellipsis ${textProps}`}
                >
                  {mess.textContent}
                </div>
              </div>
            );
          })}
      </div>
      <div className={"w-full h-[1px] bg-gray-300"} />
      <div className={"w-full flex gap-1 justify-center items-center p-2"}>
        <input
          placeholder={"Start typing ..."}
          className={"py-1 px-2 flex-1 border-none outline-0 "}
          ref={chatInputRef}
          onKeyDown={handleSendMessage}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={status !== ConversationStatus.OnGoing}
        />
        <button
          className={
            "size-10 bg-amber-500 text-white font-semibold rounded-full flex justify-center items-center disabled:bg-gray-200"
          }
          disabled={status !== ConversationStatus.OnGoing}
        >
          <SendHorizonal className={"size-5 rounded-full"} />
        </button>
      </div>
    </>
  );
}
