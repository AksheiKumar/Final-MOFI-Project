    import React, { useState, useEffect, useRef } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import {
        FiHome, FiTrendingUp, FiClock, FiStar,
        FiHeart, FiSettings, FiMenu, FiBell, FiSearch, FiUser, FiX
    } from 'react-icons/fi';
    import ProfileDropdown from '../common/ProfileDropdown';

    const Sidebar = ({
        currentPage, setCurrentPage, activeTab, setActiveTab, onToggleSidebar,
        isLoggedIn, onOpenAuthModal, isProfileDropdownOpen, onToggleProfileDropdown, onLogout
    }) => {
        const navigate = useNavigate();
        const [isOpen, setIsOpen] = useState(true);
        const [showNotifications, setShowNotifications] = useState(false);
        const [showSearch, setShowSearch] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [searchResults, setSearchResults] = useState([]);
        const searchInputRef = useRef(null);
        const searchContainerRef = useRef(null);

        // Mock data - replace with your actual data
        const allMoviesData = [];
        const allTVSeriesData = [];
        const allAnimeData = [];

        const notifications = [
            {
                id: 1,
                type: 'new_release',
                title: 'New Release: Kalvan',
                message: 'Now available to watch!',
                time: '5 min ago',
                image: '/images/Kalvan.jpg',
                unread: true
            },
            {
                id: 2,
                type: 'reminder',
                title: 'Watch Reminder',
                message: 'Continue watching "Family Star" - Episode 3',
                time: '1 hour ago',
                image: '/images/Family Star.jpg',
                unread: true
            },
            {
                id: 3,
                type: 'new_release',
                title: 'New Episodes Available',
                message: 'Stranger Things Season 5 - 3 new episodes',
                time: '2 hours ago',
                image: '/images/Stranger Things.jpg',
                unread: true
            },
            {
                id: 4,
                type: 'reminder',
                title: 'Watch Reminder',
                message: 'You added "Bhool Bhulaiyaa" to your watchlist',
                time: '5 hours ago',
                image: '/images/Bhool Bhulaiyaa.jpg',
                unread: false
            },
            {
                id: 5,
                type: 'recommendation',
                title: 'Recommended for You',
                message: 'Based on your watch history: Premalu',
                time: '1 day ago',
                image: '/images/Premalu.jpg',
                unread: false
            },
            {
                id: 6,
                type: 'new_release',
                title: 'Coming Soon',
                message: 'Bagheera - Releasing tomorrow!',
                time: '1 day ago',
                image: '/images/Bagheera.jpg',
                unread: false
            }
        ];

        const unreadCount = notifications.filter(n => n.unread).length;

        const pageToRoute = {
            'Home': '/',
            'TV Series': '/tv-series',
            'Movies': '/movies',
            'Animes': '/animes',
            'Trends': '/trends',
            'Coming Soon': '/coming-soon',
            'Rated Movies': '/rated-movies',
            'Fan Favourite': '/fan-favourite',
            'Settings': '/settings',
            'Profile': '/profile',
        };

        const toggleSidebar = () => {
            const newState = !isOpen;
            setIsOpen(newState);
            onToggleSidebar(newState);
        };

        const handleNavigation = (pageName) => {
            const route = pageToRoute[pageName];
            if (route) {
                navigate(route);
                if (window.innerWidth < 1024) {
                    toggleSidebar();
                }
            }
        };

        const handleSearch = (query) => {
            setSearchQuery(query);
            
            if (query.trim()) {
                // Mock search results - replace with actual search logic
                const mockResults = [
                    { id: 1, name: 'Stranger Things', genre: 'Sci-Fi, Horror', rating: 8.7, src: '/images/Stranger Things.jpg', type: 'TV Series' },
                    { id: 2, name: 'Kalvan', genre: 'Action, Drama', rating: 8.5, src: '/images/Kalvan.jpg', type: 'Movie' },
                    { id: 3, name: 'Premalu', genre: 'Romance, Comedy', rating: 8.3, src: '/images/Premalu.jpg', type: 'Movie' },
                    { id: 4, name: 'Attack on Titan', genre: 'Anime, Action', rating: 9.0, src: '/images/Attack on Titan.jpg', type: 'Anime' },
                    { id: 5, name: 'Family Star', genre: 'Family, Drama', rating: 7.8, src: '/images/Family Star.jpg', type: 'Movie' },
                    { id: 6, name: 'Bhool Bhulaiyaa', genre: 'Horror, Comedy', rating: 7.5, src: '/images/Bhool Bhulaiyaa.jpg', type: 'Movie' },
                    { id: 7, name: 'Bagheera', genre: 'Action, Thriller', rating: 8.1, src: '/images/Bagheera.jpg', type: 'Movie' },
                    { id: 8, name: 'Naruto', genre: 'Anime, Adventure', rating: 8.7, src: '/images/Naruto.jpg', type: 'Anime' },
                ];
                const filtered = mockResults.filter(item => 
                    item.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 8);
                setSearchResults(filtered);
            } else {
                setSearchResults([]);
            }
        };

        const handleSearchToggle = () => {
            const newState = !showSearch;
            setShowSearch(newState);
            if (newState) {
                // Close other popups
                setShowNotifications(false);
                if (isProfileDropdownOpen) onToggleProfileDropdown();
                
                // Focus input after a small delay
                setTimeout(() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }, 100);
            } else {
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        const handleSearchResultClick = (item) => {
            let route = '/';
            if (item.type === 'Movie') route = `/movie/${item.id}`;
            else if (item.type === 'TV Series') route = `/tv-series/${item.id}`;
            else if (item.type === 'Anime') route = `/anime/${item.id}`;
            
            navigate(route);
            setShowSearch(false);
            setSearchQuery('');
            setSearchResults([]);
        };

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                }
            };

            if (showSearch) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showSearch]);

        const menuItems = [
            { name: 'Home', icon: FiHome },
            { name: 'Trends', icon: FiTrendingUp },
            { name: 'Coming Soon', icon: FiClock },
            { name: 'Rated Movies', icon: FiStar },
            { name: 'Fan Favourite', icon: FiHeart },
        ];

        const generalItems = [
            { name: 'Settings', icon: FiSettings },
        ];

        const renderNavSection = (title, items) => (
            <div className="mb-6 md:mb-8">
                <h3 className="text-gray-500 text-xs uppercase font-semibold mb-2 md:mb-3 tracking-widest">
                    {title}
                </h3>
                <nav>
                    {items.map((item) => {
                        const isActive = item.name === currentPage;
                        return (
                            <button
                                key={item.name}
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    handleNavigation(item.name);
                                }}
                                className={`w-full flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-xl transition-colors duration-200 relative text-sm md:text-base
                                    ${isActive
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium shadow-lg shadow-amber-900/50'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                                `}
                            >
                                {isActive && (
                                    <span className="absolute right-0 w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-l-lg"></span>
                                )}
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        );

        return (
            <>
                {/* TOP BAR */}
                <div className="bg-gray-800 text-white antialiased flex items-center justify-between px-4 md:px-6 py-3 fixed top-0 left-0 right-0 z-40 h-14 md:h-16">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="mr-2 md:mr-4 hover:text-amber-500" aria-label="Toggle navigation">
                            <FiMenu className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <Link
                            to="/"
                            onClick={() => setActiveTab('TV Series')}
                            className="text-xl md:text-2xl font-extrabold tracking-tight whitespace-nowrap 
                            focus:outline-none rounded-sm cursor-pointer"
                            aria-label="Go to dashboard"
                        >
                            <span className="text-white">MO</span>
                            <span className="text-amber-600">FI</span>
                        </Link>
                    </div>

                    {/* Center: Tabs - hidden on mobile */}
                    <div className="hidden md:flex space-x-4 lg:space-x-8 text-sm lg:text-lg font-medium ">
                        {['TV Series', 'Movies', 'Animes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    handleNavigation(tab);
                                    setActiveTab(tab);
                                }}
                                className={`pb-1 transition whitespace-nowrap ${
                                    currentPage === tab
                                        ? 'text-amber-500 border-b-2 border-amber-500 font-semibold'
                                        : 'text-gray-400 hover:text-amber-400'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Right: Search Bar and Icons */}
                    <div className="flex items-center space-x-3 md:space-x-6 relative" ref={searchContainerRef}>
                        {/* Search Input in Navbar */}
                        <div className="relative">
                            <button
                                onClick={handleSearchToggle}
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Search"
                            >
                                <FiSearch className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {showSearch && (
                                <div className="flex items-center">
                                    <div className="absolute right-0 top-0">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search movies, TV series, anime..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="bg-gray-700 text-white rounded-lg pl-10 pr-10 py-2 w-64 md:w-80 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm transition-all duration-300"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                    searchInputRef.current?.focus();
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                            >
                                            </button>
                                        )}
                                    </div>
                                    
                                </div>
                            )}
                        </div>

                        {/* Search Results Panel - Covers right side */}
                        {showSearch && (
                            <div className="absolute right-0 top-full mt-4 w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] max-w-4xl bg-gray-800 rounded-lg shadow-2xl border border-gray-700 max-h-[80vh] overflow-hidden z-50">
                                <div className="flex flex-col h-full">
                                    {/* Search Results Content */}
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {searchResults.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {searchResults.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSearchResultClick(item)}
                                                        className="bg-gray-700/50 hover:bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] group border border-gray-600"
                                                    >
                                                        <div className="flex gap-3">
                                                            <img 
                                                                src={item.src} 
                                                                alt={item.name}
                                                                className="w-20 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                                                                    <span className="text-amber-500 font-bold text-xs">⭐ {item.rating}</span>
                                                                </div>
                                                                <p className="text-gray-400 text-xs mt-1">{item.genre}</p>
                                                                <div className="mt-2">
                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                        item.type === 'Movie' ? 'bg-blue-900/30 text-blue-400' :
                                                                        item.type === 'TV Series' ? 'bg-purple-900/30 text-purple-400' :
                                                                        'bg-green-900/30 text-green-400'
                                                                    }`}>
                                                                        {item.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-gray-600">
                                                            <button className="w-full text-center text-amber-500 hover:text-amber-400 text-sm font-medium transition">
                                                                Watch Now →
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : searchQuery.trim() ? (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                                                <h3 className="text-white font-semibold text-lg mb-2">No results found</h3>
                                                <p className="text-gray-400">Try different keywords</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-amber-500 text-4xl mb-4">🎬</div>
                                                <h3 className="text-white font-semibold text-lg mb-2">Search MOFI Library</h3>
                                                <p className="text-gray-400 mb-6">Type to search for movies, TV shows, anime and more</p>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                                                    {['Action Movies', 'Popular TV Shows', 'Latest Anime', 'Top Rated'].map((category) => (
                                                        <button
                                                            key={category}
                                                            onClick={() => handleSearch(category.split(' ')[0])}
                                                            className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg p-3 text-sm transition"
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Filters */}
                                    {searchResults.length > 0 && (
                                        <div className="p-4 border-t border-gray-700 bg-gray-800/90">
                                            <h4 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">QUICK FILTERS</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Anime', 'TV Series'].map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => handleSearch(filter)}
                                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full text-xs transition"
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notification Bell */}
                        <div className="relative hidden sm:block">
                            <button 
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (showSearch) handleSearchToggle();
                                }}
                                className="relative"
                            >
                                <FiBell className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-white cursor-pointer transition" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-full mt-1 w-80 md:w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-h-[32rem] overflow-hidden z-50">
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
                                        <h3 className="text-lg font-bold text-white">Notifications</h3>
                                        <button 
                                            onClick={() => setShowNotifications(false)}
                                            className="text-gray-400 hover:text-white transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Notifications List */}
                                    <div className="overflow-y-auto max-h-[28rem]">
                                        {notifications.map((notification) => (
                                            <div 
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition ${
                                                    notification.unread ? 'bg-gray-700/30' : ''
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    {/* Notification Image */}
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={notification.image} 
                                                            alt={notification.title}
                                                            className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover"
                                                        />
                                                    </div>

                                                    {/* Notification Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="text-sm font-semibold text-white truncate">
                                                                {notification.title}
                                                            </h4>
                                                            {notification.unread && (
                                                                <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="p-3 border-t border-gray-700 bg-gray-800">
                                        <button className="w-full text-center text-sm text-amber-600 hover:text-amber-500 font-semibold transition">
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile/Auth */}
                        <div className="relative">
                            {!isLoggedIn ? (
                                <button
                                    onClick={onOpenAuthModal}
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-1 px-3 md:px-4 rounded-full text-sm whitespace-nowrap shadow-lg shadow-amber-900/50 hover:shadow-xl transition-all"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            onToggleProfileDropdown();
                                            if (showSearch) handleSearchToggle();
                                        }}
                                        className="block rounded-full overflow-hidden w-8 h-8 md:w-9 md:h-9 border-2 border-gray-600 hover:border-amber-500 transition-colors"
                                    >
                                        <FiUser className="w-full h-full p-1 bg-gray-700" />
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <ProfileDropdown
                                            handleLogout={onLogout}
                                            setCurrentPage={setCurrentPage}
                                            onClose={onToggleProfileDropdown}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
                        onClick={toggleSidebar}
                    />
                )}

                {/* SIDEBAR */}
                <div
                    className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col p-4 md:p-6 h-screen w-64 md:w-72 lg:w-64
                    fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out
                    pt-16 md:pt-20 overflow-y-auto shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    {/* Mobile Navigation Tabs */}
                    <div className="md:hidden mb-6 pb-4 border-b border-gray-700">
                        <h3 className="text-gray-500 text-xs uppercase font-semibold mb-3 tracking-widest">Browse</h3>
                        <div className="space-y-1">
                            {['TV Series', 'Movies', 'Animes'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        handleNavigation(tab);
                                        setActiveTab(tab);
                                        toggleSidebar(); // Close sidebar after selection
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                                        currentPage === tab
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    {renderNavSection('MENU', menuItems)}
                    {renderNavSection('GENERAL', generalItems)}
                </div>
            </>
        );
    };

    export default Sidebar;