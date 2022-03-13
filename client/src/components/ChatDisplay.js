import { Chat } from "../components/Chat";
import { ChatInput } from "../components/ChatInput";

export const ChatDisplay = () => {
  return (
    <div className="flex flex-col flex-grow">
      <Chat />
      <ChatInput />
    </div>
  );
};
