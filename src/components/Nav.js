import logoWhite from "../images/logo-white.svg";
import logoDark from "../images/logo-full.svg";

export const Nav = ({ minimal, setShowModal, setIsSignUp }) => {
  const authToken = true;

  return (
    <nav className="flex items-center p-6">
      <div>
        <img
          src={minimal ? logoDark : logoWhite}
          alt="tinder"
          className="h-8"
        />
      </div>
      {!authToken && !minimal && (
        <div className="ml-auto">
          <button
            className="nav-btn"
            onClick={() => {
              setShowModal(true);
              setIsSignUp(false);
            }}
          >
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
};
