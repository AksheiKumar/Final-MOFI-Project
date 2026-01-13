// components/pages/FavoritesPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiStar, FiCalendar, FiClock } from 'react-icons/fi';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');

    // Load favorites from localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem('userFavorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Filter favorites by type
    const filteredFavorites = activeFilter === 'All' 
        ? favorites 
        : favorites.filter(item => item.type === activeFilter);

    const handleRemoveFavorite = (id) => {
        const updatedFavorites = favorites.filter(item => item.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
    };

    const handleItemClick = (item) => {
        const routeMap = {
            'Movie': `/movie/${item.id}`,
            'TV Series': `/tv-series/${item.id}`,
            'Anime': `/anime/${item.id}`
        };
        navigate(routeMap[item.type] || '/');
    };

    const filterOptions = ['All', 'Movie', 'TV Series', 'Anime'];

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 md:px-6 lg:px-8 py-6 md:py-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <FiHeart className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold">My Favorites</h1>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 md:px-6 py-2 rounded-lg font-medium transition whitespace-nowrap
                                ${activeFilter === filter
                                    ? 'bg-amber-500 text-gray-900'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Favorites Count */}
                <div className="mb-6">
                    <p className="text-gray-400">
                        {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {/* Favorites Grid */}
                {filteredFavorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 md:py-24">
                        <FiHeart className="w-16 h-16 md:w-24 md:h-24 text-gray-700 mb-4" />
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-500 mb-2">
                            No favorites yet
                        </h2>
                        <p className="text-gray-600 text-center max-w-md">
                            Start adding movies, TV series, and anime to your favorites by clicking the heart icon on any content.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {filteredFavorites.map((item) => (
                            <div
                                key={item.id}
                                className="group relative cursor-pointer"
                            >
                                {/* Movie Card */}
                                <div 
                                    className="relative overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 group-hover:scale-105"
                                    onClick={() => handleItemClick(item)}
                                >
                                    {/* Image */}
                                    <div className="aspect-[2/3] relative">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/300x450?text=No+Image'}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* Type Badge */}
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs font-semibold">
                                            {item.type}
                                        </div>

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                                                    {item.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <FiStar className="w-3 h-3 text-amber-500" />
                                                            <span>{item.rating}</span>
                                                        </div>
                                                    )}
                                                    {item.year && (
                                                        <div className="flex items-center gap-1">
                                                            <FiCalendar className="w-3 h-3" />
                                                            <span>{item.year}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Title and Actions */}
                                <div className="mt-2 space-y-1">
                                    <h3 className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-amber-500 transition">
                                        {item.title}
                                    </h3>
                                    
                                    {/* Remove from Favorites Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFavorite(item.id);
                                        }}
                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                                    >
                                        <FiHeart className="w-3 h-3 fill-current" />
                                        
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
