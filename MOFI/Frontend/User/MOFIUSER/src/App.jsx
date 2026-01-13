import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard, { OtherPageContent, allMoviesData, allTVSeriesData, allAnimeData } from './components/pages/Dashboard';
import Sidebar from './components/layout/Sidebar';
import AuthModal from './components/pages/AuthModal';
import ProfilePage from './components/pages/ProfilePage';
import SettingsPage from './components/pages/SettingsPage';
import FavoritesPage from './components/pages/FavoritesPage';
import MovieDetail from './components/pages/MovieDetail';
import Footer from './components/layout/Footer';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeContentTab, setActiveContentTab] = useState('TV Series');

    // Authentication
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Check if navigation state wants to open auth modal
    useEffect(() => {
        if (location.state?.openAuthModal) {
            setIsAuthModalOpen(true);
            // Clear the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // Map routes to page names
    const routeToPageName = {
        '/': 'Home',
        '/home': 'Home',
        '/tv-series': 'TV Series',
        '/movies': 'Movies',
        '/animes': 'Animes',
        '/trends': 'Trends',
        '/coming-soon': 'Coming Soon',
        '/rated-movies': 'Rated Movies',
        '/fan-favourite': 'Fan Favourite',
        '/settings': 'Settings',
        '/profile': 'Profile',
        '/favorites': 'Favorites',
        '/login': 'Login',
    };

    const currentPage = routeToPageName[location.pathname] || 'Home';

    const handleLogin = () => {
        setIsLoggedIn(true);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsProfileDropdownOpen(false);
        navigate('/');
    };

    const handleNavigation = (pageName) => {
        const route = Object.keys(routeToPageName).find(
            key => routeToPageName[key] === pageName
        );
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white antialiased">
            <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={handleNavigation}
                activeTab={activeContentTab}
                setActiveTab={setActiveContentTab}
                onToggleSidebar={setIsSidebarOpen}
                isLoggedIn={isLoggedIn}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                isProfileDropdownOpen={isProfileDropdownOpen}
                onToggleProfileDropdown={() => setIsProfileDropdownOpen(prev => !prev)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div
                className={`flex-1 bg-gray-900 transition-all duration-300 overflow-y-auto
                pt-14 md:pt-20 px-0 md:px-4 lg:px-8 pb-0
                ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}
            >
                <Routes>
                    <Route path="/" element={
                        <Dashboard
                            activeTab={activeContentTab}
                            setActiveTab={setActiveContentTab}
                        />
                    } />
                    <Route path="/home" element={
                        <Dashboard
                            activeTab={activeContentTab}
                            setActiveTab={setActiveContentTab}
                        />
                    } />
                    <Route path="/tv-series" element={<OtherPageContent title="TV Series" />} />
                    <Route path="/movies" element={<OtherPageContent title="Movies" />} />
                    <Route path="/movie/:id" element={<MovieDetail allContent={allMoviesData} contentType="Movie" />} />
                    <Route path="/tv-series/:id" element={<MovieDetail allContent={allTVSeriesData} contentType="TV Series" />} />
                    <Route path="/anime/:id" element={<MovieDetail allContent={allAnimeData} contentType="Anime" />} />
                    <Route path="/animes" element={<OtherPageContent title="Animes" />} />
                    <Route path="/trends" element={<OtherPageContent title="Trends" />} />
                    <Route path="/coming-soon" element={<OtherPageContent title="Coming Soon" />} />
                    <Route path="/rated-movies" element={<OtherPageContent title="Rated Movies" />} />
                    <Route path="/fan-favourite" element={<OtherPageContent title="Fan Favourite" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/login" element={
                        <AuthModal
                            onClose={() => navigate('/')}
                            onLoginSuccess={handleLogin}
                        />
                    } />
                </Routes>
            </div>
            </div>

            {/* Footer - Full Width */}
            <Footer />

            {/* Auth Modal */}
            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setIsAuthModalOpen(false)}
                    onLoginSuccess={handleLogin}
                />
            )}
        </div>
    );
}

export default App;
