import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { MOVIES_PER_PAGE } from '../../constants/config';

const ContinueWatchingCard = ({ name, progress, src, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gray-900 rounded-2xl p-2 md:p-3 flex flex-col items-center shadow-md transition hover:scale-105 hover:shadow-amber-900/30 hover:shadow-xl cursor-pointer"
  >
    <div className="relative rounded-xl overflow-hidden w-full h-28 md:h-32 lg:h-36 mb-2 md:mb-3">
      <img src={src} alt={name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
        <button className="p-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition shadow-lg">
          <FiClock className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
    <p className="font-semibold text-center text-white text-sm truncate w-full">{name}</p>
    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
    <p className="text-gray-400 text-xs mt-1">{progress}% watched</p>
  </div>
);

const ContinueWatchingSection = ({ continueWatching }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(continueWatching.length / MOVIES_PER_PAGE);
  const startIndex = currentPage * MOVIES_PER_PAGE;
  const currentMovies = continueWatching.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  
  const handleMovieClick = (item) => {
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <section className="mb-6 lg:mb-10 pr-0 lg:pr-4 text-white">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">Continue Watching</h3>
        <div className="flex space-x-3">
          <button onClick={handlePrev} disabled={currentPage === 0} className={`p-2 rounded-full transition ${currentPage === 0 ? 'text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600'}`}>
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} disabled={currentPage === totalPages - 1} className={`p-2 rounded-full transition ${currentPage === totalPages - 1 ? 'text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600'}`}>
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {currentMovies.map((movie, index) => (
          <ContinueWatchingCard 
            key={index} 
            {...movie} 
            onClick={() => handleMovieClick(movie)}
          />
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingSection;
