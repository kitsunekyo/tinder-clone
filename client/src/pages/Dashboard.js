import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

import { CONFIG } from "../config";
import { useAuth } from "../AuthProvider";
import { ChatContainer } from "../components/ChatContainer";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const updateMatches = async (swipedUserId, result) => {
    await fetch(`${CONFIG.apiUrl}/users/${user.user_id}/swipe`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ swipedUserId, result }),
    });

    getUsersByGender(user.user_id, user.gender_interest);
  };

  const swiped = (direction, userId) => {
    const result = direction === "right" ? "like" : "dislike";
    updateMatches(userId, result);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const getUsersByGender = useCallback(async (userId, genderInterest) => {
    const url = new URL(`${CONFIG.apiUrl}/users`);
    const params = { gender: genderInterest };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const res = await fetch(url, {
      credentials: "include",
    });
    const data = await res.json();
    setUsers(data);
  }, []);

  useEffect(() => {
    if (!user) return;

    getUsersByGender(user.user_id, user.gender_interest);
  }, [user, getUsersByGender]);

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
