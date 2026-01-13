import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fetchedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [createdMovies, setCreatedMovies] = useState([]);
  const [crewMovies, setCrewMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id || fetchedRef.current) return;

    fetchedRef.current = true;

    const fetchAccessibleMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all accessible movies from new backend endpoint
        const res = await axios.get(
          `http://127.0.0.1:8080/accessible/Movie/${user.id}/accessible-movies`
        );
        
        const moviesData = res.data.accessible_movies;
        setAllMovies(moviesData);
        
        // Separate movies by type
        const created = moviesData.filter(movie => 
          movie.access_type === "creator" || movie.is_creator === true
        );
        const crew = moviesData.filter(movie => 
          movie.access_type === "crew_member" && !movie.is_creator
        );
        
        setCreatedMovies(created);
        setCrewMovies(crew);
        
        console.log("✅ Accessible movies loaded:", {
          total: moviesData.length,
          created: created.length,
          crew: crew.length
        });
        
      } catch (err) {
        console.error("❌ Failed to fetch accessible movies:", err);
        setError("Failed to load your movies. Please try again.");
        

        try {
          const res = await axios.get(
            `http://127.0.0.1:8080/movies/getmoviebyuserId/${user.id}`
          );
          const movies = res.data.map(movie => ({
            ...movie,
            access_type: "creator",
            is_creator: true,
            contribution: "Creator",
            permissions: {
              video: true,
              image: true,
              live: true,
              scripts: true,
              crew: true
            }
          }));
          setAllMovies(movies);
          setCreatedMovies(movies);
          setCrewMovies([]);
        } catch (fallbackErr) {
          console.error("❌ Fallback also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccessibleMovies();
  }, [user?.id]);

  // Get movies based on active section
  const getCurrentMovies = () => {
    switch (activeSection) {
      case "created":
        return createdMovies;
      case "crew":
        return crewMovies;
      default:
        return allMovies;
    }
  };

  // Filter movies based on search
  const getFilteredMovies = () => {
    const currentMovies = getCurrentMovies();
    
    if (!searchQuery) return currentMovies;
    
    return currentMovies.filter(
      (movie) =>
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (movie.contribution && movie.contribution.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredMovies = getFilteredMovies();

  const handleDeleteMovie = async (movieId) => {
    // Check if user is the creator of this movie
    const movieToDelete = allMovies.find(m => m.movie_id === movieId);
    
    if (!movieToDelete || (!movieToDelete.is_creator && movieToDelete.access_type !== "creator")) {
      alert("❌ You don't have permission to delete this movie");
      return;
    }

    if (!window.confirm("⚠️ Do you really want to delete this movie?\nThis action cannot be undone.")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8080/movies/delete/${movieId}`,
        {
          withCredentials: true
        }
      );

      // Remove from all states
      setAllMovies(prev => prev.filter(m => m.movie_id !== movieId));
      setCreatedMovies(prev => prev.filter(m => m.movie_id !== movieId));
      setCrewMovies(prev => prev.filter(m => m.movie_id !== movieId));
      
      alert("✅ Movie deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete movie");
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "created":
        return "Movies I Created";
      case "crew":
        return "Movies I'm Working On";
      default:
        return "All My Movies";
    }
  };

  const getSectionCount = () => {
    switch (activeSection) {
      case "created":
        return createdMovies.length;
      case "crew":
        return crewMovies.length;
      default:
        return allMovies.length;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-500">
                {getSectionTitle()}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-gray-400">
                  {filteredMovies.length} movie(s) showing
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded">
                    Created: {createdMovies.length}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded">
                    Crew: {crewMovies.length}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/add-movie")}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Movie
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveSection("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeSection === "all"
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              All Movies
            </button>
            
            <button
              onClick={() => setActiveSection("created")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeSection === "created"
                  ? "bg-gradient-to-r from-green-700 to-green-800 text-white border border-green-600"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Created by Me
            </button>
            
            <button
              onClick={() => setActiveSection("crew")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeSection === "crew"
                  ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white border border-blue-600"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Crew Projects
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center mt-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
              <p className="text-white mt-6 text-lg">Loading your movies...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching created movies and crew projects</p>
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onDelete={handleDeleteMovie}
                  showDeleteButton={movie.is_creator || movie.access_type === "creator"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-black/50 rounded-2xl border border-gray-700/50">
              <div className="mb-6">
                {activeSection === "created" ? (
                  <div className="inline-block p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-full">
                    <svg className="w-20 h-20 text-green-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                ) : activeSection === "crew" ? (
                  <div className="inline-block p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full">
                    <svg className="w-20 h-20 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                ) : (
                  <div className="inline-block p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full">
                    <svg className="w-20 h-20 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                {activeSection === "created" 
                  ? "No Movies Created Yet" 
                  : activeSection === "crew" 
                  ? "No Crew Projects Yet"
                  : "No Movies Found"}
              </h3>
              
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {activeSection === "created" 
                  ? "You haven't created any movies yet. Start by creating your first movie project!"
                  : activeSection === "crew"
                  ? "You haven't been added as a crew member to any projects yet. Ask project owners to add you."
                  : searchQuery 
                  ? "No movies match your search. Try different keywords."
                  : "No movies found in this section."}
              </p>
              
              {activeSection === "created" && (
                <button
                  onClick={() => navigate("/add-movie")}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Create Your First Movie
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;