import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

import { CONFIG } from "../config";
import { useAuth } from "../AuthProvider";
import { ChatContainer } from "../components/ChatContainer";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [lastDirection, setLastDirection] = useState(null);

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  useEffect(() => {
    if (!user) return;

    const url = new URL(`${CONFIG.apiUrl}/users`);
    const params = { gender: user?.gender_interest };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const getUsersByGender = async () => {
      const res = await fetch(url, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data.filter((u) => u.user_id !== user.user_id));
    };
    getUsersByGender();
  }, [user]);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex gap-6">
      <div className="w-1/3 h-screen">
        <ChatContainer />
      </div>

      <div className="w-2/3 h-screen flex items-center flex-col justify-center overflow-hidden gap-4">
        <div className="relative w-[450px] h-[600px] mx-auto">
          {users.map((user) => (
            <TinderCard
              className="absolute"
              key={user.first_name}
              onSwipe={(direction) => swiped(direction, user.first_name)}
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
        <div className="h-8 flex items-center">
          {lastDirection && (
            <p className="text-center text-xl">You swiped {lastDirection}</p>
          )}
        </div>
      </div>
    </div>
  );
};
