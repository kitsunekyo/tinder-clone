import { useState } from "react";
import TinderCard from "react-tinder-card";

import { ChatContainer } from "../components/ChatContainer";

const db = [
  {
    name: "Richard Hendricks",
    url: "https://i.pravatar.cc/600",
  },
  {
    name: "Erlich Bachman",
    url: "https://i.pravatar.cc/600",
  },
  {
    name: "Monica Hall",
    url: "https://i.pravatar.cc/600",
  },
  {
    name: "Jared Dunn",
    url: "https://i.pravatar.cc/600",
  },
  {
    name: "Dinesh Chugtai",
    url: "https://i.pravatar.cc/600",
  },
];

export const Dashboard = () => {
  const characters = db;
  const [lastDirection, setLastDirection] = useState(null);

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/3 h-screen">
        <ChatContainer />
      </div>

      <div className="w-2/3 h-screen flex items-center flex-col justify-center overflow-hidden gap-4">
        <div className="relative w-[450px] h-[600px] mx-auto">
          {characters.map((character) => (
            <TinderCard
              className="absolute"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="relative w-[450px] h-[600px] rounded-2xl bg-cover bg-center flex items-end justify-center shadow-md"
              >
                <h3 className="text-white">{character.name}</h3>
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
