import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

function Navbar({ onToggleSidebar, searchQuery, onSearchChange }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { setUser } = useAuth(); // you also need this
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

 const logout = async () => {
  try {
    // Call your backend logout
    await fetch("http://localhost:8001/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // Clear user from context
    setUser(null);

    // Clear access token if stored
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAccessToken(null); 

    // Redirect to login page
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  // ...rest of your component


  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Left: Hamburger Menu & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
              Producer Hub
            </span>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right: Bell Icon & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Bell Icon */}
            <button className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
                  {/* Profile Button */}
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors rounded-lg flex items-center space-x-2"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors rounded-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
