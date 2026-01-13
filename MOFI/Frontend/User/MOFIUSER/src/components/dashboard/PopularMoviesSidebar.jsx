import React from 'react';

const PopularMoviesSidebar = ({ popularMovies, onMovieSelect }) => (
  <aside className="hidden lg:flex lg:flex-col w-80 bg-gray-900 border-l border-gray-800 flex-shrink-0 p-4 h-full overflow-y-auto">
    <div>
      <h3 className="text-xl font-bold mb-4">Popular Movies</h3>
      <div className="space-y-4">
        {popularMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onMovieSelect(movie)}
            className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
          >
            <img src={movie.src} alt={movie.name} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <p className="font-semibold">{movie.name}</p>
              <p className="text-gray-400 text-sm">{movie.genre}</p>
              <span className="text-yellow-400 text-sm font-bold flex items-center">
                <span className="mr-1">⭐</span>{movie.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

export default PopularMoviesSidebar;
