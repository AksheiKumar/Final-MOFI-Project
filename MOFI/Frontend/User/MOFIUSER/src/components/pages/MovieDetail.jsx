import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiThumbsUp, FiThumbsDown, FiShare2, FiBookmark, FiPlay, FiStar, FiHeart } from 'react-icons/fi';

const dummyTrailers = [
  { id: 1, title: 'Official Final Trailer', duration: '2:20', thumbnail: '/John Wick.jpg', likes: 583, loves: 245 },
  { id: 2, title: 'Official Teaser', duration: '2:23', thumbnail: '/Mad Max.jpg', likes: 1200, loves: 426 },
  { id: 3, title: 'Behind the Scenes', duration: '2:19', thumbnail: '/Ip Man 2.jpg', likes: 4, loves: 7 },
];

const dummyPhotos = [
  { id: 1, src: '/John Wick.jpg' },
  { id: 2, src: '/Mad Max.jpg' },
  { id: 3, src: '/Ip Man 2.jpg' },
  { id: 4, src: '/Extraction 2.jpg' },
  { id: 5, src: '/Mission Impossible.jpg' },
  { id: 6, src: '/The Dark Knight.jpg' },
];

const dummyCast = [
  { id: 1, name: 'Peter Claffey', character: "Ser Duncan 'Dunk' the Tall", episodes: '7 episodes', year: '2025-2027', photo: '/charlize theron.jpg' },
  { id: 2, name: 'Dexter Sol Ansell', character: 'Egg', episodes: '7 episodes', year: '2025-2027', photo: '/Laurence Fishburne.jpg' },
  { id: 3, name: 'Daniel Ings', character: "Ser Lyonel 'The Laughing Storm'", episodes: '6 episodes', year: '2025', photo: '/Martin Freeman.jpg' },
  { id: 4, name: 'Sam Spruell', character: 'Prince Maekar Targaryen', episodes: '6 episodes', year: '2025', photo: '/Keanu Reeves.jpg' },
  { id: 5, name: 'Bertie Carvel', character: "Prince Baelor 'Breakspear'", episodes: '6 episodes', year: '2025', photo: '/tom hanks.jpg' },
  { id: 6, name: 'Finn Bennett', character: "Prince Aerion 'Brightflame'", episodes: '6 episodes', year: '2025', photo: '/scarlett johansson.jpg' },
];

const MovieDetail = ({ allContent, contentType = "Movie" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reactions, setReactions] = useState({ likes: 582, dislikes: 23, hearts: 245, laughs: 89, wows: 156 });
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [showRateButton, setShowRateButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find the content by ID
  const movie = allContent?.find(m => m.id === parseInt(id));

  // Check if this movie is in favorites
  useEffect(() => {
    if (movie) {
      const storedFavorites = localStorage.getItem('userFavorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setIsFavorite(favorites.some(fav => fav.id === movie.id && fav.type === contentType));
      }
    }
  }, [movie, contentType]);

  // Toggle favorite
  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem('userFavorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    const favoriteItem = {
      id: movie.id,
      title: movie.name,
      image: movie.src,
      type: contentType,
      rating: movie.rating,
      year: '2025',
      genre: movie.genre
    };

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(fav => !(fav.id === movie.id && fav.type === contentType));
    } else {
      // Add to favorites
      favorites.push(favoriteItem);
    }

    localStorage.setItem('userFavorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Create trailer object based on the actual movie data
  const mainTrailer = movie ? {
    id: movie.id,
    title: `${movie.name} - Official Trailer`,
    duration: '2:30',
    thumbnail: movie.heroSrc || movie.src,
    likes: Math.floor(movie.rating * 100),
    loves: Math.floor(movie.rating * 50)
  } : null;

  if (!movie) {
    return (
      <div className="flex-grow flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{contentType} Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-6 py-2 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleReaction = (type) => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    setShowRatingPopup(false);
  };

  // Generate dynamic trailers for this specific content
  const contentTrailers = movie ? [
    { 
      id: 1, 
      title: `${movie.name} - Official Trailer`, 
      duration: '2:30', 
      thumbnail: movie.heroSrc || movie.src, 
      likes: Math.floor(movie.rating * 100), 
      loves: Math.floor(movie.rating * 50) 
    },
    { 
      id: 2, 
      title: `${movie.name} - Teaser`, 
      duration: '1:45', 
      thumbnail: movie.src, 
      likes: Math.floor(movie.rating * 80), 
      loves: Math.floor(movie.rating * 40) 
    },
    { 
      id: 3, 
      title: `${movie.name} - Behind the Scenes`, 
      duration: '3:15', 
      thumbnail: movie.heroSrc || movie.src, 
      likes: Math.floor(movie.rating * 60), 
      loves: Math.floor(movie.rating * 30) 
    },
  ] : [];

  const contentPhotos = movie ? [
    { id: 1, src: movie.src },
    { id: 2, src: movie.heroSrc || movie.src },
    { id: 3, src: movie.src },
    { id: 4, src: movie.heroSrc || movie.src },
    { id: 5, src: movie.src },
    { id: 6, src: movie.heroSrc || movie.src },
  ] : [];

  return (
    <div className="flex-grow overflow-y-auto bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Title & Genre */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{movie.name}</h1>
          <div className="flex items-center gap-3 text-gray-400">
            <span>{contentType}</span>
            <span>•</span>
            <span>{movie.genre}</span>
            <span>•</span>
            <span>2025</span>
            <span>•</span>
            <span>HD</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button 
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              isFavorite 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition">
            <FiBookmark className="w-4 h-4" />
            Watchlist
          </button>
          
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition">
            <FiShare2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Hero Section - IMDB Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main Trailer - Left Side (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
              {selectedPhoto ? (
                // Show selected photo
                <>
                  <img 
                    src={selectedPhoto.src} 
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-900 p-2 rounded-full transition"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                // Show trailer - thumbnail first, then video when clicked
                <>
                  {!isPlaying ? (
                    // Thumbnail view with play button
                    <>
                      <img 
                        src={mainTrailer.thumbnail} 
                        alt={mainTrailer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button onClick={() => setIsPlaying(true)} className="group">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-900/50 transform group-hover:scale-110 transition-all duration-300 ring-4 ring-white/20">
                            <FiPlay className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                          </div>
                          <p className="text-white text-xs md:text-sm font-semibold mt-2">Play trailer {mainTrailer.duration}</p>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Video player view
                    <div className="w-full h-full bg-black">
                      <video 
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        poster={mainTrailer.thumbnail}
                      >
                        <source src={`/videos/${movie.name.replace(/\s+/g, '_')}.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button 
                        onClick={() => setIsPlaying(false)}
                        className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-900 p-2 rounded-full transition z-10"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reaction Icons and Info Below Trailer */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => handleReaction('likes')}
                className="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full transition-all text-xs"
              >
                <FiThumbsUp className="w-3 h-3 text-blue-400" />
                <span>{reactions.likes}</span>
              </button>
              
              <button 
                onClick={() => handleReaction('dislikes')}
                className="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full transition-all text-xs"
              >
                <FiThumbsDown className="w-3 h-3 text-gray-400" />
                <span>{reactions.dislikes}</span>
              </button>
              
              <button 
                onClick={() => handleReaction('hearts')}
                className="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full transition-all text-xs"
              >
                <span>❤️</span>
                <span>{reactions.hearts}</span>
              </button>
              
              <button 
                onClick={() => handleReaction('laughs')}
                className="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full transition-all text-xs"
              >
                <span>😂</span>
                <span>{reactions.laughs}</span>
              </button>
              
              <button 
                onClick={() => handleReaction('wows')}
                className="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full transition-all text-xs"
              >
                <span>😮</span>
                <span>{reactions.wows}</span>
              </button>

              <div className="flex-1" />

              {/* Genre Tags */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded text-xs border border-gray-600">Action</span>
                <span className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded text-xs border border-gray-600">Horror</span>
              </div>

              {/* Rating - Clickable */}
              <div className="relative">
                <button 
                  onClick={() => setShowRateButton(!showRateButton)}
                  className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 px-2 py-1 rounded-full text-xs font-bold hover:from-amber-700 hover:to-orange-700 transition"
                >
                  <FiStar className="w-3 h-3 fill-white text-white" />
                  <span>{movie.rating}/10</span>
                </button>
                
                {showRateButton && (
                  <button 
                    onClick={() => {
                      setShowRatingPopup(true);
                      setShowRateButton(false);
                    }}
                    className="absolute top-full mt-2 right-0 bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition shadow-lg z-10"
                  >
                    Rate This Movie
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Videos and Photos Cards */}
          <div className="space-y-4">
            {/* Videos Card */}
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative aspect-video">
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FiPlay className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white font-bold text-base">{contentTrailers.length} VIDEOS</p>
                </div>
              </div>
            </div>

            {/* Photos Card */}
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative aspect-video">
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-base">{contentPhotos.length} PHOTOS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Popup Modal */}
        {showRatingPopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowRatingPopup(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Rate This Movie</h2>
                <p className="text-gray-400 mb-6">{movie.name}</p>
                
                {/* 10 Star Rating */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transform hover:scale-125 transition-transform"
                    >
                      <FiStar 
                        className={`w-8 h-8 ${
                          star <= (hoverRating || userRating) 
                            ? 'fill-amber-500 text-amber-500' 
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {userRating > 0 && (
                  <p className="text-amber-500 text-lg font-bold mb-4">
                    Your rating: {userRating}/10 ⭐
                  </p>
                )}

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowRatingPopup(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowRatingPopup(false)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        {/* Videos Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 mr-3 rounded-full"></span>
              Videos
              <span className="ml-3 text-gray-500 text-xl">{contentTrailers.length}</span>
            </h2>
            <button className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2">
              View All
              <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {contentTrailers.map((trailer, index) => (
              <div 
                key={trailer.id}
                onClick={() => {
                  // Scroll to top to view the main trailer
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group cursor-pointer ${index === 0 ? 'ring-2 ring-amber-500' : ''}`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 mb-2">
                  <img 
                    src={trailer.thumbnail} 
                    alt={trailer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center shadow-xl">
                      <FiPlay className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-gray-900/90 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {trailer.duration}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-amber-500 transition line-clamp-2">{trailer.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiThumbsUp className="w-3 h-3" /> {trailer.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {trailer.loves}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Photos Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 mr-3 rounded-full"></span>
              Photos
              <span className="ml-3 text-gray-500 text-xl">{contentPhotos.length}</span>
            </h2>
            <button className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2">
              View All
              <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {contentPhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 cursor-pointer ${selectedPhoto?.id === photo.id ? 'ring-2 ring-amber-500' : ''}`}
              >
                <img 
                  src={photo.src} 
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        {/* Top Cast Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 mr-3 rounded-full"></span>
              Top Cast
              <span className="ml-3 text-gray-500 text-xl">{dummyCast.length}</span>
            </h2>
            <button className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2">
              View All
              <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {dummyCast.map((cast) => (
              <div 
                key={cast.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-full overflow-hidden bg-gray-800 mb-3 ring-4 ring-gray-700 group-hover:ring-amber-500 transition-all">
                  <img 
                    src={cast.photo} 
                    alt={cast.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-center mb-1 group-hover:text-amber-500 transition">{cast.name}</h3>
                <p className="text-sm text-gray-400 text-center line-clamp-2 mb-1">{cast.character}</p>
                <p className="text-xs text-gray-500 text-center">
                  <span className="text-blue-400">{cast.episodes}</span> • {cast.year}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetail;
