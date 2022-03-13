import TinderCard from "react-tinder-card";

import { ChatContainer } from "../components/ChatContainer";
import { fetchApi } from "../utils/api";

import { useGetMatches } from "../hooks/useGetMatches";
import { useGetUsers } from "../hooks/useGetUsers";

export const Dashboard = () => {
  const { matches, getMatches } = useGetMatches();
  const { users, getUsers } = useGetUsers();

  const setSwipe = async (swipedUserId, result) => {
    await fetchApi(`/swipe`, {
      method: "post",
      body: { swipedUserId, result },
    });

    getUsers();
    getMatches();
  };

  const swiped = (direction, userId) => {
    const result = direction === "right" ? "like" : "dislike";
    setSwipe(userId, result);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const handleUpdate = () => {
    getMatches();
    getUsers();
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/3 h-screen">
        <ChatContainer matches={matches} onUpdate={handleUpdate} />
      </div>

      <div className="w-2/3 h-screen flex items-center flex-col justify-center overflow-hidden gap-4">
        <div className="relative w-[450px] h-[600px] mx-auto">
          {users.map((user) => (
            <TinderCard
              className="absolute"
              key={user.first_name}
              onSwipe={(direction) => swiped(direction, user.user_id)}
              onCardLeftScreen={() => outOfFrame(user.first_name)}
            >
              <div
                style={{ backgroundImage: `url(${user.url})` }}
                className="relative w-[450px] h-[600px] rounded-2xl bg-cover bg-center flex items-end justify-center shadow-md"
              >
                <h3 className="text-white">{user.first_name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};
