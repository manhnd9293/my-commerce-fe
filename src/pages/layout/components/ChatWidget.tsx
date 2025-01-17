import { useEffect, useRef, useState } from "react";
import { MessageCircle, Paperclip, SendHorizonal, XIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { UserState } from "@/store/user/userSlice.ts";
import { RootState } from "@/store";

function ChatWidget() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState([]);
  const currentUser: UserState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const accessToken = localStorage.getItem("accessToken");
    const socket = io(serverUrl, {
      autoConnect: false,
      withCredentials: true,
      auth: {
        Authorization: accessToken,
      },
    });
    if (showChatBox) {
      socket.connect();
      socket.on("connect", () => {
        socket.on("messages", (data) => {
          setMessages((m) => m.concat(data));
        });
      });
    }

    return () => {
      if (!socket.connected) {
        return;
      }
      socket.off("message");
      socket.disconnect();
      socket.close();
    };
  }, [showChatBox]);

  useEffect(() => {
    if (showChatBox && chatInputRef?.current) {
      chatInputRef.current.focus();
    }
  }, [showChatBox]);

  if (!showChatBox) {
    return (
      <div
        className={
          "bg-amber-600 hover:bg-amber-500 w-[50px] h-[50px] rounded-full fixed bottom-5 right-12 flex justify-center items-center text-white cursor-pointer animate-wiggle shadow-md"
        }
        onClick={() => setShowChatBox(true)}
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
          onClick={() => setShowChatBox(false)}
        >
          <XIcon className={"size-4 font-lights"} />
        </div>
      </div>
      <div className={"w-full h-[1px] bg-gray-300"}></div>
      <div className={`flex-1 rounded-md bg-gray-50`}></div>
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
    </div>
  );
}

export default ChatWidget;
