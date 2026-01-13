import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainContent = ({ currentHeroMovie, setCurrentHeroMovie, popularMovies }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroMovie((prev) => {
        const i = popularMovies.findIndex((m) => m.id === prev.id);
        return popularMovies[(i + 1) % popularMovies.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [setCurrentHeroMovie, popularMovies]);

  const handleHeroClick = () => {
    let contentType = 'movie';
    if (currentHeroMovie.id >= 101 && currentHeroMovie.id <= 199) {
      contentType = 'tv-series';
    } else if (currentHeroMovie.id >= 201 && currentHeroMovie.id <= 299) {
      contentType = 'anime';
    }
    navigate(`/${contentType}/${currentHeroMovie.id}`);
  };

  return (
    <main className="pr-0 lg:pr-4">
      <div 
        onClick={handleHeroClick}
        className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-700 rounded-lg overflow-hidden mb-6 lg:mb-10 cursor-pointer group"
      >
        <img src={currentHeroMovie.heroSrc} alt={currentHeroMovie.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent p-4 md:p-6 lg:p-8 flex flex-col justify-end">
          <span className="text-amber-500 text-xs md:text-sm font-semibold mb-1 md:mb-2">{currentHeroMovie.genre}</span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 group-hover:text-amber-500 transition-colors">{currentHeroMovie.name.toUpperCase()}</h2>
          <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6 w-full md:w-2/3 line-clamp-3">{currentHeroMovie.description}</p>
          <div className="flex items-center gap-2 text-sm text-amber-500 font-semibold">
            <span>Click to watch trailer</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
