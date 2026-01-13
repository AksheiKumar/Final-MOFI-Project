import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  allMoviesData, 
  allTVSeriesData, 
  allAnimeData,
  allContent,
  popularMoviesData,
  fanFavouriteData,
  ratedMoviesData,
  comingSoonData,
  allArtists,
  allContinueWatching
} from '../../data/moviesData';
import MainContent from '../dashboard/MainContent';
import PopularMoviesSidebar from '../dashboard/PopularMoviesSidebar';
import ArtistsSection from '../dashboard/ArtistsSection';
import ContinueWatchingSection from '../dashboard/ContinueWatchingSection';
import MovieCard from '../dashboard/MovieCard';

export const OtherPageContent = ({ title }) => {
  const navigate = useNavigate();
  let displayMovies = [];
  
  if (title === 'Movies') {
    displayMovies = allMoviesData;
  } else if (title === 'TV Series') {
    displayMovies = allTVSeriesData;
  } else if (title === 'Animes') {
    displayMovies = allAnimeData;
  } else if (title === 'Fan Favourite') {
    displayMovies = fanFavouriteData;
  } else if (title === 'Rated Movies') {
    displayMovies = ratedMoviesData;
  } else if (title === 'Coming Soon') {
    displayMovies = comingSoonData;
  } else if (title === 'Trends') {
    displayMovies = allContent.sort((a, b) => b.rating - a.rating).slice(0, 20);
  }

  const handleMovieClick = (movieId) => {
    const isMovie = allMoviesData.find(m => m.id === movieId);
    const isTVSeries = allTVSeriesData.find(m => m.id === movieId);
    const isAnime = allAnimeData.find(m => m.id === movieId);
    
    if (isMovie) {
      navigate(`/movie/${movieId}`);
    } else if (isTVSeries) {
      navigate(`/tv-series/${movieId}`);
    } else if (isAnime) {
      navigate(`/anime/${movieId}`);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto pr-0 lg:pr-4 px-4 lg:px-0">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 mt-4 text-white">
        {title}
      </h2>
      
      {displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 pb-8">
          {displayMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-700 rounded-lg flex items-center justify-center mb-6 md:mb-10">
          <p className="text-gray-400 text-2xl">This is the dedicated {title} page!</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ activeTab, setActiveTab }) => {
  const [currentHeroMovie, setCurrentHeroMovie] = useState(popularMoviesData[0]);

  return (
    <div className="bg-gray-900 text-white w-full h-full overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full h-full">
        {activeTab === 'TV Series' ? (
          <>
            <div className="flex-grow lg:pt-4 overflow-y-auto lg:max-h-screen px-4 lg:px-0">
              <MainContent 
                currentHeroMovie={currentHeroMovie} 
                setCurrentHeroMovie={setCurrentHeroMovie}
                popularMovies={popularMoviesData}
              />
              <ArtistsSection artists={allArtists} />
              <ContinueWatchingSection continueWatching={allContinueWatching} />
            </div>
            <PopularMoviesSidebar 
              popularMovies={popularMoviesData}
              onMovieSelect={(movie) => setCurrentHeroMovie(movie)} 
            />
          </>
        ) : (
          <OtherPageContent title={activeTab} />
        )}
      </div>
    </div>
  );
};

export { allMoviesData, allTVSeriesData, allAnimeData };
export default Dashboard;
