import { ChatHeader } from "../components/ChatHeader";
import { MatchesDisplay } from "../components/MatchesDisplay";
import { ChatDisplay } from "../components/ChatDisplay";

export const ChatContainer = () => {
  return (
    <div className="bg-white shadow-md h-full">
      <ChatHeader />

      <div className="flex border-b border-gray-300">
        <button
          disabled
          className="flex-1 border-b-4 border-orange-600 text-xl p-4 disabled:border-gray-400 disabled:text-gray-400"
        >
          Matches
        </button>
        <button className="flex-1 border-b-4 border-orange-600 text-xl p-4 disabled:border-gray-400">
          Chat
        </button>
      </div>

      <MatchesDisplay />
      <ChatDisplay />
    </div>
  );
};
