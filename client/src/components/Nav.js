import logoWhite from "../images/logo-white.svg";
import logoDark from "../images/logo-full.svg";
import { NavLink } from "react-router-dom";

export const Nav = ({ minimal, setShowModal, setIsSignUp, user }) => {
  return (
    <nav className="flex items-center px-6 h-20">
      <NavLink to="/">
        <img
          src={minimal ? logoDark : logoWhite}
          alt="tinder"
          className="h-8"
        />
      </NavLink>
      {user && (
        <div className="ml-auto flex items-center gap-4 text-white text-lg">
          <NavLink to="/dashboard">
            <div className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
              Dashboard
            </div>
          </NavLink>
          <NavLink to="/onboarding">
            <div className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
              Profile
            </div>
          </NavLink>
        </div>
      )}
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
