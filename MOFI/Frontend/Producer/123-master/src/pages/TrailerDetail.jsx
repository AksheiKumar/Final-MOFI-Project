import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAuth } from "../auth/AuthContext";

function TrailerDetail() {
  const { id: movieId, trailerId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasVideoPermission, setHasVideoPermission] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  /* ================= NORMALIZERS (OPTION 1) ================= */
  const normalizeMovie = (m) => ({
    movieId: m.movie_id,
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
    name: t.trailer_name,
    description: t.description || "",
    videoUrl: t.video_url,
    thumbnailUrl: t.thumbnail_url,
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, trailerRes] = await Promise.all([
          api.get(`http://127.0.0.1:8080/movies/movie_details/${movieId}`),
          api.get(`http://127.0.0.1:8080/trailers/${trailerId}`),
        ]);

        setMovie(normalizeMovie(movieRes.data));
        setTrailer(normalizeTrailer(trailerRes.data));
        
        // Fetch user permissions for this movie
        if (user?.id) {
          try {
            const permissionsRes = await api.get(
              `http://127.0.0.1:8080/accessible/Movie/${user.id}/movie/${movieId}/permissions`
            );
            
            if (permissionsRes.data.has_access) {
              setHasVideoPermission(permissionsRes.data.permissions?.video || false);
            }
          } catch (err) {
            console.log("Error fetching permissions:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load trailer detail:", err);
        navigate("/");
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchData();
  }, [movieId, trailerId, navigate, user]);

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

  const handleEditTrailer = () => {
    if (!hasVideoPermission) {
      alert("You don't have permission to edit trailers for this movie.");
      return;
    }
    navigate(`/movie/${movie.movieId}/add-trailer?id=${trailer.trailerId}`);
  };

  if (!movie || !trailer || loadingPermissions) {
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
          onClick={() => navigate(`/movie/${movie.movieId}`)}
          className="text-gray-400 hover:text-amber-500 mb-6"
        >
          ← Back to Movie
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
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {trailer.name}
                  </h1>
                  <p className="text-zinc-400 mt-2">{trailer.description}</p>
                </div>
                {!hasVideoPermission && (
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-medium rounded-full border border-gray-600">
                    View Only
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={handleFullscreen}
                  className="px-5 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  Fullscreen
                </button>

                <button
                  onClick={handleShare}
                  className="px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>

                <button
                  onClick={handleDownload}
                  className="px-5 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>

                {hasVideoPermission && (
                  <button
                    onClick={handleEditTrailer}
                    className="px-5 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-amber-500/10 transition-shadow">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
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
              <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                <span className="text-zinc-400 font-medium">Access Level</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  hasVideoPermission 
                    ? "bg-gradient-to-r from-green-700 to-emerald-700 text-white" 
                    : "bg-gray-700 text-gray-300"
                }`}>
                  {hasVideoPermission ? "Can Edit" : "View Only"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-blue-500/10 transition-shadow">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistics</span>
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-xl">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Total Views</p>
                    <p className="text-white font-bold text-xl">0</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-red-600/30 to-red-700/30 rounded-xl">
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Likes</p>
                    <p className="text-white font-bold text-xl">0</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded-xl">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Shares</p>
                    <p className="text-white font-bold text-xl">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrailerDetail;