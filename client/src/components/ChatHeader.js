import { useAuth } from "../AuthProvider";
import { ReactComponent as LogoutIcon } from "../images/logout.svg";

export const ChatHeader = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="bg-gradient-to-tr from-pink-600 to-orange-600 h-24 flex items-center p-6 gap-4">
      <img
        src="https://i.pravatar.cc/300"
        alt=""
        className="rounded-full h-12 w-12"
      />

      <h3 className="text-white">username</h3>

      <button
        onClick={handleLogout}
        className="ml-auto w-9 h-9 grid place-items-center hover:bg-gray-100/20 rounded-lg"
      >
        <LogoutIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};
