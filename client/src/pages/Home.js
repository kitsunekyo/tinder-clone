import { useState } from "react";

import { AuthModal } from "../components/AuthModal";
import { Nav } from "../components/Nav";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const authToken = false;

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
        />
        <div className="text-center flex-grow flex flex-col justify-center items-center">
          <h1 className="text-7xl font-bold text-white mb-6">Swipe Right®</h1>
          {authToken ? (
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
