import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { ReactComponent as CloseIcon } from "../images/close.svg";
import { ReactComponent as FlameIcon } from "../images/flame.svg";

export const AuthModal = ({ onClose, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await login(email, password, isSignUp);
      if (isSignUp) {
        navigate("/onboarding");
        return;
      }
      navigate("/dashboard");
    } catch (e) {
      console.log("something went wrong", e);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-gray-900/80 flex flex-col items-center justify-center">
      <div className="mx-auto bg-white p-6 rounded-md w-full max-w-[400px] min-h-[300px]">
        <div className="flex items-center">
          <button className="ml-auto" onClick={onClose}>
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <FlameIcon className="mx-auto h-9 w-9" />

        <h2 className="title">{isSignUp ? "Create account" : "Sign in"}</h2>

        <p className="mb-6 text-center font-light text-sm">
          By clicking submit, you agree to our terms and conditions. Learn how
          we process your data in our privacy policy and cookie policy.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="email"
            autoComplete="email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="password"
            autoComplete="password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <input
              className="input"
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="confirm password"
              autoComplete="password"
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input type="submit" value="Submit" className="btn--secondary" />
          <p className="text-red-600 py-4">{error}</p>
        </form>

        <hr className="mb-4" />

        <h2 className="title">Get the app</h2>
      </div>
    </div>
  );
};
