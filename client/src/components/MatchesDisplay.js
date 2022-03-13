import { useAuth } from "../AuthProvider";

export const MatchesDisplay = () => {
  const { user } = useAuth();
  return (
    <div>
      {user.matches
        ? user.matches.map((match) => (
            <div key={match.id}>{match.first_name}</div>
          ))
        : "No matches yet"}
    </div>
  );
};
