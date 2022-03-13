import { ReactComponent as BackspaceIcon } from "../images/backspace.svg";
import { CONFIG } from "../config";

export const MatchesDisplay = ({ onClick, matches, onUnmatched }) => {
  const hasMatches = matches?.length > 0;

  const handleUnmatch = async (userId) => {
    const res = await fetch(`${CONFIG.apiUrl}/matches`, {
      method: "delete",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ unmatchUserId: userId }),
    });
    if (res.status === 200) {
      onUnmatched();
    }
  };

  return (
    <div className="bg-gray-100 flex-grow overflow-x-auto">
      {hasMatches ? (
        <div className="flex flex-col gap-4 p-4">
          {matches.map((match) => (
            <div
              role="button"
              key={match.user_id}
              className="flex items-center shadow p-4 gap-4 bg-white rounded-lg hover:shadow-md"
              onClick={() => onClick(match)}
            >
              <img
                src={match.url}
                alt={match.first_name}
                className="h-8 w-8 rounded-full bg-cover bg-center"
              />
              {match.first_name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnmatch(match.user_id);
                }}
                className="ml-auto w-9 h-9 grid place-items-center hover:bg-gray-100 rounded-lg"
              >
                <BackspaceIcon className="text-red-600 h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">No matches yet</div>
      )}
    </div>
  );
};
