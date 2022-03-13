import { useState, useEffect, useCallback } from "react";
import { CONFIG } from "../config";
import { Chat } from "../components/Chat";
import { ChatInput } from "../components/ChatInput";

export const ChatDisplay = ({ partnerId }) => {
  const [messages, setMessages] = useState([]);

  const getMessages = useCallback(async () => {
    const res = await fetch(`${CONFIG.apiUrl}/messages/${partnerId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setMessages(data);
  }, [partnerId]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  const handleMessageSent = () => {
    getMessages();
  };

  return (
    <div className="flex flex-col flex-grow">
      <Chat messages={messages} partnerId={partnerId} />
      <ChatInput partnerId={partnerId} onSent={handleMessageSent} />
    </div>
  );
};
