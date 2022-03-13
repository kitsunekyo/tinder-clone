import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { ReactComponent as HeartIcon } from "../images/heart.svg";

export const MatchesDisplay = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function getMatches() {
      const res = await fetch(`${CONFIG.apiUrl}/matches`, {
        credentials: "include",
      });
      const data = await res.json();
      setMatches(data);
    }
    getMatches();
  }, []);

  const hasMatches = matches?.length > 0;

  return (
    <div className="bg-gray-100 flex-grow overflow-x-auto">
      {hasMatches ? (
        <div className="flex flex-col gap-4 p-4">
          {matches.map((match) => (
            <div
              key={match.user_id}
              className="flex items-center shadow p-4 gap-4 bg-white rounded-lg"
            >
              <img
                src={match.url}
                alt={match.first_name}
                className="h-8 w-8 rounded-full bg-cover bg-center"
              />
              {match.first_name}
              <HeartIcon className="ml-auto text-red-600 h-6 w-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">No matches yet</div>
      )}
    </div>
  );
};
