import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiBell, FiUser, FiChevronLeft, FiChevronRight, FiClock, FiMenu } from "react-icons/fi";

/* =======================
   API CONFIG
======================= */
const API = axios.create({
  baseURL: "http://127.0.0.1:8080",
  withCredentials: true,
});

// Constants for pagination and display
const ARTISTS_PER_PAGE = 4;
const INITIAL_POPULAR_LIMIT = 3;
const INITIAL_FAVORITES_LIMIT = 3;
const DUMMY_MOVIE_DESCRIPTION = "Explore this movie's captivating plot, thrilling action sequences, and stellar cast. Click to watch!";

// Dummy artists data (you can replace this with API call if available)
const allArtists = [
  { name: 'Charlize Theron', movies: '+12 Movies', src: '/charlize theron.jpg' },
  { name: 'Laurence Fishburne', movies: '+27 Movies', src: '/Laurence Fishburne.jpg' },
];

// Dummy continue watching data (you can replace this with API call if available)
const allContinueWatching = [
  { id: 4, name: 'Matrix Revolution', progress: 75, src: "/Matrix Revolution.jpg", type: 'movie' },
  { id: 1, name: 'Deadpool', progress: 50, src: "/Deadpool.jpg", type: 'movie' },
];

// Transform API movie data to match the UI structure
const transformMovieData = (movie) => ({
  id: movie.movie_id,
  name: movie.title,
  genre: movie.genres?.join(", ") || "N/A",
  rating: movie.rate?.avg || 0,
  src: movie.image1 || "/placeholder.jpg",
  heroSrc: movie.image1 || "/placeholder.jpg",
  description: DUMMY_MOVIE_DESCRIPTION,
  type: movie.type || "movie"
});

/* =======================
   POPULAR MOVIES SIDEBAR
======================= */
const PopularMoviesSidebar = ({ onMovieSelect, popularMovies }) => (
  <aside className="hidden lg:flex lg:flex-col w-80 bg-gray-900 border-l border-gray-800 flex-shrink-0 p-4 h-full overflow-y-auto">
    <div>
      <h3 className="text-xl font-bold mb-4 text-white">Popular Movies</h3>
      <div className="space-y-4">
        {popularMovies.slice(0, 6).map((movie) => (
          <div
            key={movie.id}
            onClick={() => onMovieSelect(movie)}
            className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
          >
            <img src={movie.src} alt={movie.name} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <p className="font-semibold text-white">{movie.name}</p>
              <p className="text-gray-400 text-sm">{movie.genre}</p>
              <span className="text-yellow-400 text-sm font-bold flex items-center">
                <span className="mr-1">⭐</span>{movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

/* =======================
   MOVIE CARD COMPONENT
======================= */
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
        ⭐ {movie.rating.toFixed(1)}
      </div>
    </div>
    <div className="p-2">
      <p className="text-pink-500 text-xs font-semibold mb-1 capitalize">{movie.type || "Movie"}</p>
      <h3 className="text-white font-semibold text-xs mb-1.5 line-clamp-2 leading-tight">{movie.name}</h3>
      <div className="flex items-center space-x-1">
        <span className="text-pink-500 text-sm">❤</span>
        <span className="text-gray-400 text-xs">{Math.floor(movie.rating * 10)}</span>
      </div>
    </div>
  </div>
);

/* =======================
   MAIN CONTENT (Hero Banner)
======================= */
const MainContent = ({ currentHeroMovie, setCurrentHeroMovie, popularMovies }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (popularMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroMovie((prev) => {
          const i = popularMovies.findIndex((m) => m.id === prev.id);
          return popularMovies[(i + 1) % popularMovies.length];
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [setCurrentHeroMovie, popularMovies]);

  const handleHeroClick = () => {
    navigate(`/movie/${currentHeroMovie.id}`);
  };

  if (!currentHeroMovie) return null;

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

/* =======================
   ARTISTS SECTION
======================= */
const ArtistCard = ({ name, movies, src }) => (
  <div className="bg-gray-900 rounded-2xl p-3 md:p-4 flex flex-col items-center shadow-md transition hover:scale-105 hover:shadow-amber-900/30 hover:shadow-xl">
    <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-3 md:border-4 border-gradient-to-r from-amber-600 to-orange-600 overflow-hidden flex-shrink-0 shadow-lg shadow-amber-900/30">
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
    <p className="font-semibold text-center mt-2 md:mt-3 text-white text-sm md:text-base line-clamp-2 w-full px-1">{name}</p>
    <p className="text-gray-400 text-xs md:text-sm truncate w-full text-center">{movies}</p>
  </div>
);

const ArtistsSection = ({ allArtists }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(allArtists.length / ARTISTS_PER_PAGE);
  const startIndex = currentPage * ARTISTS_PER_PAGE;
  const currentArtists = allArtists.slice(startIndex, startIndex + ARTISTS_PER_PAGE);

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

/* =======================
   CONTINUE WATCHING SECTION
======================= */
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

const ContinueWatchingSection = ({ allContinueWatching }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const MOVIES_PER_PAGE = 4;
  const totalPages = Math.ceil(allContinueWatching.length / MOVIES_PER_PAGE);
  const startIndex = currentPage * MOVIES_PER_PAGE;
  const currentMovies = allContinueWatching.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  
  const handleMovieClick = (item) => {
    navigate(`/movie/${item.id}`);
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

/* =======================
   ALL MOVIES GRID SECTION
======================= */
const AllMoviesGrid = ({ movies, onMovieClick }) => {
  return (
    <div className="flex-grow overflow-y-auto pr-0 lg:pr-4 px-4 lg:px-0">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 mt-4 text-white">
        All Movies
      </h2>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 pb-8">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => onMovieClick(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-700 rounded-lg flex items-center justify-center mb-6 md:mb-10">
          <p className="text-gray-400 text-2xl">No movies available</p>
        </div>
      )}
    </div>
  );
};

/* =======================
   DASHBOARD MAIN COMPONENT
======================= */
const Dashboard = () => {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroMovie, setCurrentHeroMovie] = useState(null);
  const [showAllMovies, setShowAllMovies] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await API.get("/movies/user/getallmovies");
        const transformedMovies = res.data.map(transformMovieData);
        setAllMovies(transformedMovies);
        
        // Set initial hero movie (highest rated)
        if (transformedMovies.length > 0) {
          const highestRated = [...transformedMovies].sort((a, b) => b.rating - a.rating)[0];
          setCurrentHeroMovie(highestRated);
        }
      } catch (err) {
        console.error("Failed to load movies", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Get popular movies (top rated)
  const popularMovies = [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white w-full min-h-screen">
      <div className="flex flex-col lg:flex-row w-full">
        {showAllMovies ? (
          <AllMoviesGrid 
            movies={allMovies} 
            onMovieClick={handleMovieClick}
          />
        ) : (
          <>
            <div className="flex-grow lg:pt-4 overflow-y-auto lg:max-h-screen px-4 lg:px-0">
              <MainContent 
                currentHeroMovie={currentHeroMovie} 
                setCurrentHeroMovie={setCurrentHeroMovie}
                popularMovies={popularMovies}
              />
              <ArtistsSection allArtists={allArtists} />
              <ContinueWatchingSection allContinueWatching={allContinueWatching} />
              
              {/* Featured Movies Section */}
              <section className="mb-6 lg:mb-10 pr-0 lg:pr-4 text-white">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">Featured Movies</h3>
                  <button 
                    onClick={() => setShowAllMovies(true)}
                    className="text-amber-500 hover:text-amber-400 font-semibold text-sm md:text-base transition"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {popularMovies.slice(0, 12).map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onClick={() => handleMovieClick(movie.id)}
                    />
                  ))}
                </div>
              </section>
            </div>
            
            {/* Popular Movies Sidebar */}
            <PopularMoviesSidebar 
              onMovieSelect={(movie) => {
                setCurrentHeroMovie(movie);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              popularMovies={popularMovies}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;