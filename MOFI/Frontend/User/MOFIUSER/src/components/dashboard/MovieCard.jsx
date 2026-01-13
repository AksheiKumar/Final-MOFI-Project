import React from 'react';

const MovieCard = ({ movie, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-amber-900/50 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group max-w-[200px]"
  >
    <div className="relative aspect-[3/4] overflow-hidden">
      <img 
        src={movie.src} 
        alt={movie.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
        ⭐ {movie.rating}
      </div>
    </div>
    <div className="p-2">
      <p className="text-pink-500 text-xs font-semibold mb-1">HD Movies</p>
      <h3 className="text-white font-semibold text-xs mb-1.5 line-clamp-2 leading-tight">{movie.name}</h3>
      <div className="flex items-center space-x-1">
        <span className="text-pink-500 text-sm">❤</span>
        <span className="text-gray-400 text-xs">{Math.floor(movie.rating * 100)}</span>
      </div>
    </div>
  </div>
);

export default MovieCard;
