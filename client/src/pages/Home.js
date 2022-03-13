import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthModal } from "../components/AuthModal";
import { Nav } from "../components/Nav";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("http://localhost:8000/me", {
          credentials: "include",
        });
        if (res.status !== 200) {
          console.log("User is not logged in");
          return;
        }

        const data = await res.json();
        if (data) {
          console.log("User is logged in");
          setUser(data);
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }
    getUser();
  }, [navigate]);

  const handleClick = () => {
    setIsSignUp(true);
    setShowModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-no-repeat bg-center bg-cover bg-fixed flex flex-col home-bg">
        <Nav
          minimal={false}
          setShowModal={setShowModal}
          setIsSignUp={setIsSignUp}
          user={user}
        />
        <div className="text-center flex-grow flex flex-col justify-center items-center">
          <h1 className="text-7xl font-bold text-white mb-6">Swipe Right®</h1>
          {user ? (
            <button className="btn--primary">Sign out</button>
          ) : (
            <button onClick={handleClick} className="btn--primary">
              Create account
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} isSignUp={isSignUp} />
      )}
    </>
  );
};
