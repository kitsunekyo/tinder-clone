import { useState } from "react";

import { ChatHeader } from "../components/ChatHeader";
import { MatchesDisplay } from "../components/MatchesDisplay";
import { ChatDisplay } from "../components/ChatDisplay";

export const ChatContainer = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectMatch = (match) => {
    setSelectedUser(match.user_id);
  };

  return (
    <div className="bg-white shadow-md h-full flex flex-col">
      <ChatHeader />

      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setSelectedUser(null)}
          className="flex-1 border-b-4 border-orange-600 text-black p-4 disabled:border-gray-400 disabled:text-gray-400 hover:text-black transition-colors"
        >
          Matches
        </button>
        <button
          disabled={!selectedUser}
          className="flex-1 border-b-4 border-orange-600 text-black p-4 disabled:border-gray-400 disabled:text-gray-400 hover:text-black transition-colors"
        >
          Chat
        </button>
      </div>

      {!selectedUser && <MatchesDisplay onClick={handleSelectMatch} />}
      {selectedUser && <ChatDisplay partnerId={selectedUser} />}
    </div>
  );
};
