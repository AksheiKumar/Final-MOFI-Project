import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MovieDetail from "./pages/MovieDetail";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import AuthModal from "./pages/AuthModal";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuth } from "./auth/AuthContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const routeToPageName = {
    "/": "Home",
    "/home": "Home",
    "/movies": "Movies",
    "/tv-series": "TV Series",
    "/animes": "Animes",
    "/trends": "Trends",
    "/coming-soon": "Coming Soon",
    "/rated-movies": "Rated Movies",
    "/fan-favourite": "Fan Favourite",
    "/settings": "Settings",
    "/profile": "Profile",
    "/login": "Login",
  };

  const currentPage = routeToPageName[location.pathname] || "Home";

  const handleNavigation = (pageName) => {
    const route = Object.keys(routeToPageName).find(
      (key) => routeToPageName[key] === pageName
    );
    if (route) navigate(route);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white antialiased">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={handleNavigation}
          onToggleSidebar={setIsSidebarOpen}
          isLoggedIn={isLoggedIn}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          isProfileDropdownOpen={isProfileDropdownOpen}
          onToggleProfileDropdown={() =>
            setIsProfileDropdownOpen((prev) => !prev)
          }
          onLogout={handleLogout}
        />

        <div
          className={`flex-1 bg-gray-900 transition-all duration-300 overflow-y-auto
            pt-14 md:pt-20 px-0 md:px-4 lg:px-8
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
        >
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/movies" element={<Dashboard />} />
            <Route path="/tv-series" element={<Dashboard />} />
            <Route path="/animes" element={<Dashboard />} />

            {/* Movie / TV / Anime Detail */}
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv-series/:id" element={<MovieDetail />} />
            <Route path="/anime/:id" element={<MovieDetail />} />

            {/* Settings / Profile */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Login Modal */}
            <Route path="/login" element={<AuthModal onClose={() => navigate("/")} />} />
          </Routes>
        </div>
      </div>

      <Footer />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

export default App;
