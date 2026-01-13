import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ARTISTS_PER_PAGE } from '../../constants/config';

const ArtistCard = ({ name, movies, src }) => (
  <div className="bg-gray-900 rounded-2xl p-3 md:p-4 flex flex-col items-center shadow-md transition hover:scale-105 hover:shadow-amber-900/30 hover:shadow-xl">
    <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-3 md:border-4 border-gradient-to-r from-amber-600 to-orange-600 overflow-hidden flex-shrink-0 shadow-lg shadow-amber-900/30">
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
    <p className="font-semibold text-center mt-2 md:mt-3 text-white text-sm md:text-base line-clamp-2 w-full px-1">{name}</p>
    <p className="text-gray-400 text-xs md:text-sm truncate w-full text-center">{movies}</p>
  </div>
);

const ArtistsSection = ({ artists }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(artists.length / ARTISTS_PER_PAGE);
  const startIndex = currentPage * ARTISTS_PER_PAGE;
  const currentArtists = artists.slice(startIndex, startIndex + ARTISTS_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <section className="mb-6 lg:mb-10 pr-0 lg:pr-4 text-white">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">Best Artists</h3>
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
        {currentArtists.map((artist, index) => (
          <ArtistCard key={index} {...artist} />
        ))}
      </div>
    </section>
  );
};

export default ArtistsSection;
