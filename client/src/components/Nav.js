import logoWhite from "../images/logo-white.svg";
import logoDark from "../images/logo-full.svg";
import { NavLink } from "react-router-dom";

export const Nav = ({ minimal, setShowModal, setIsSignUp, user }) => {
  return (
    <nav className="flex items-center p-6">
      <NavLink to="/">
        <img
          src={minimal ? logoDark : logoWhite}
          alt="tinder"
          className="h-8"
        />
      </NavLink>
      {!user && !minimal && (
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
