import { useAuth } from "../auth/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={user.picture}
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-amber-500 shadow-lg object-cover"
          />
        </div>

        
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome, <span className="text-amber-400">{user.name}</span>
        </h2>

        {/* Email */}
        <p className="text-center text-gray-400 mb-6">{user.email}</p>

        {/* User Info Card */}
        <div className="bg-gray-700 rounded-xl p-4 shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-amber-400">User Details</h3>
          <div className="flex flex-col gap-2 text-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">Full Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span>{user.role ?? "User"}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              // Optional: logout function from useAuth
              if (typeof user.logout === "function") user.logout();
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
