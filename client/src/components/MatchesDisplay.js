import { useAuth } from "../AuthProvider";

export const MatchesDisplay = () => {
  const { user } = useAuth();

  const hasMatches = user.matches && user.matches.length > 0;

  return (
    <div>
      {hasMatches ? (
        user.matches.map((match) => (
          <div key={match.id}>{match.first_name}</div>
        ))
      ) : (
        <div className="text-center p-6 text-gray-500">No matches yet</div>
      )}
    </div>
  );
};
