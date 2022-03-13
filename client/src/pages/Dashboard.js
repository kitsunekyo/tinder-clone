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
  const [matches, setMatches] = useState([]);

  const getMatches = useCallback(async () => {
    const res = await fetch(`${CONFIG.apiUrl}/matches`, {
      credentials: "include",
    });
    const data = await res.json();
    setMatches(data);
  }, []);

  useEffect(() => {
    getMatches();
  }, [getMatches]);

  const setSwipe = async (swipedUserId, result) => {
    await fetch(`${CONFIG.apiUrl}/swipe`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ swipedUserId, result }),
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

  const getUsers = useCallback(async () => {
    const genderInterest = user.gender_interest;
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
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getUsers();
  }, [user, getUsers]);

  const handleUpdate = () => {
    getMatches();
    getUsers();
  };

  if (!user) {
    navigate("/");
    return null;
  }

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
