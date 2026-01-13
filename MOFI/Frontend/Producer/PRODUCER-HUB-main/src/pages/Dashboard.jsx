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
  

  const fetchedRef = useRef(false); // 🔑 prevents re-fetch
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || fetchedRef.current) return;

    fetchedRef.current = true;

    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8080/movies/getmoviebyuserId/${user.id}`
        );
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user?.id]);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm( "⚠️ Do you really want to delete this movie?\nThis action cannot be undone.")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8080/movies/delete/${movieId}`,
        {
          withCredentials: true
        }
      );

      setMovies((prev) =>
        prev.filter((m) => m.movie_id !== movieId)
      );
    } catch (err) {
      alert("Failed to delete movie");
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-500">
                My Movies
              </h1>
              <p className="text-gray-400">
                {filteredMovies.length} movie(s)
              </p>
            </div>

            <button
              onClick={() => navigate("/add-movie")}
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold"
            >
              + New Movie
            </button>
          </div>

          {loading ? (
            <p className="text-white text-center mt-20">Loading...</p>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onDelete={handleDeleteMovie}
                />
              ))}
            </div>
          ) : (
            <p className="text-white text-center mt-20">
              No movies found
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
