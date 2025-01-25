import { useState } from "react";
import httpClient from "@/http-client/http-client.ts";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";

interface InitConversationProps {
  onCreateConversation: () => void;
}

function InitConversation({ onCreateConversation }: InitConversationProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleClick() {
    await httpClient.post("/conversations", {
      subject,
      message,
    });
    onCreateConversation();
  }

  return (
    <div className={"flex flex-col gap-4 p-4"}>
      <div className={"font-semibold"}>How can we help ?</div>
      <Input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder={"Subject"}
      />
      <Textarea
        placeholder={"Message"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className={"bg-amber-600 text-white"} onClick={handleClick}>
        Submit
      </Button>
    </div>
  );
}

export default InitConversation;
