import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function TrailerDetail() {
  const { movieId, trailerId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  /* ================= NORMALIZERS ================= */
  const normalizeMovie = (m) => ({
    movie_id: m.movie_id,
    imdbId: m.imdbID,
    title: m.title,
    type: m.type,
    description: m.description,
    releaseDate: m.release_date,
    duration: m.duration,
    mainImage: m.image1,
    bannerImage: m.image2,
  });

  const normalizeTrailer = (t) => ({
    trailerId: t.trailer_id,
    movieId: t.movie_id,
    name: t.trailer_name,
    description: t.description || "",
    videoUrl: t.video_url,
    thumbnailUrl: t.thumbnail_url || t.image1 || "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!movieId || !trailerId) return;

    const fetchData = async () => {
      try {
        const [movieRes, trailerRes] = await Promise.all([
          api.get(`http://127.0.0.1:8080/movies/movie_details/${movieId}`),
          api.get(`http://127.0.0.1:8080/trailers/${trailerId}`), // fetch specific trailer
        ]);

        setMovie(normalizeMovie(movieRes.data));
        setTrailer(normalizeTrailer(trailerRes.data));
      } catch (err) {
        console.error("Failed to load trailer detail:", err);
        navigate("/");
      }
    };

    fetchData();
  }, [movieId, trailerId, navigate]);

  /* ================= VIDEO CONTROLS ================= */
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: trailer.name,
        text: `Watch ${trailer.name}`,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = trailer.videoUrl;
    link.download = `${trailer.name}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = () => {
    setHasLiked((prev) => !prev);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
  };

  if (!movie || !trailer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 p-6">
        {/* Back */}
        <button
          onClick={() => navigate(`/movie/${movie.movie_id}`)}
          className="text-gray-400 hover:text-amber-500 mb-6"
        >
          ← Back
        </button>

        {/* VIDEO */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-black border border-zinc-700 shadow-2xl">
            <div className="relative aspect-video group">
              <video
                ref={videoRef}
                src={trailer.videoUrl}
                poster={trailer.thumbnailUrl}
                className="w-full h-full object-contain bg-black"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <div
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                >
                  <div className="bg-amber-600 p-6 rounded-full hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-white">{trailer.name}</h1>
              <p className="text-zinc-400 mt-2">{trailer.description}</p>

              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={handleFullscreen}
                  className="px-5 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                >
                  Fullscreen
                </button>

                <button
                  onClick={handleShare}
                  className="px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                >
                  Share
                </button>

                <button
                  onClick={handleDownload}
                  className="px-5 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                >
                  Download
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/movie/${movie.movie_id}/add-trailer?id=${trailer.trailerId}`
                    )
                  }
                  className="px-5 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700"
                >
                  Edit Trailer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS & STATISTICS */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-amber-500/10 transition-shadow">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
              <span>Details</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">Movie</span>
                <span className="text-white font-semibold">{movie.title}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">IMDB ID</span>
                <span className="text-amber-400 font-mono text-sm">{movie.imdbId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">Release Date</span>
                <span className="text-amber-400 font-mono text-sm">{movie.releaseDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">Duration</span>
                <span className="text-amber-400 font-mono text-sm">{movie.duration || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">Movie Type</span>
                <span className="text-amber-400 font-mono text-sm">{movie.type || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-blue-500/10 transition-shadow">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
              <span>Statistics</span>
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-xl"></div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Total Views</p>
                    <p className="text-white font-bold text-xl">0</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLike}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  hasLiked 
                    ? 'bg-red-600/20 border-red-500/40 hover:border-red-500/60' 
                    : 'bg-red-600/10 border-red-500/20 hover:border-red-500/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl transition-all ${
                    hasLiked
                      ? 'bg-gradient-to-br from-red-600/50 to-red-700/50'
                      : 'bg-gradient-to-br from-red-600/30 to-red-700/30'
                  }`}></div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Likes</p>
                    <p className="text-white font-bold text-xl">{likes}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${hasLiked ? 'text-red-300' : 'text-zinc-400'}`}>
                  {hasLiked ? 'Liked' : 'Like'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrailerDetail;
