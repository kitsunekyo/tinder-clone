import { useState } from "react";

import { ChatHeader } from "../components/ChatHeader";
import { MatchesDisplay } from "../components/MatchesDisplay";
import { ChatDisplay } from "../components/ChatDisplay";

export const ChatContainer = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="bg-white shadow-md h-full flex flex-col">
      <ChatHeader />

      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("matches")}
          disabled={activeTab === "matches"}
          className="flex-1 border-b-4 disabled:border-orange-600 disabled:text-black p-4 border-gray-400 text-gray-400 hover:text-black transition-colors"
        >
          Matches
        </button>
        <button
          disabled={activeTab === "chat"}
          onClick={() => setActiveTab("chat")}
          className="flex-1 border-b-4 disabled:border-orange-600 disabled:text-black p-4 border-gray-400 text-gray-400 hover:text-black transition-colors"
        >
          Chat
        </button>
      </div>

      {activeTab === "chat" && <ChatDisplay />}
      {activeTab === "matches" && <MatchesDisplay />}
    </div>
  );
};
