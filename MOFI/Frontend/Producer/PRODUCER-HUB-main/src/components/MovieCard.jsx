import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function MovieCard({ movie, onDelete }) {
  const navigate = useNavigate();
  const movieId = movie.movie_id;

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={() => navigate(`/movie/${movieId}`)}
      className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700
                 hover:border-amber-600 transition-all duration-300
                 hover:shadow-2xl hover:shadow-amber-900/50
                 hover:scale-[1.03] cursor-pointer"
    >
      {/* ===== Hover Action Buttons ===== */}
      <div
        className="absolute top-3 right-3 flex space-x-2 opacity-0 
                   group-hover:opacity-100 transition z-20"
      >
                <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-movie/${movieId}`);
          }}
          className="w-9 h-9 flex items-center justify-center
                    bg-black/70 rounded-full text-amber-400
                    hover:bg-amber-600 hover:text-white"
        >
          <FiEdit />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            stopPropagation(e);
            onDelete(movieId);
          }}
          className="p-2 bg-black/70 rounded-full text-red-400 hover:bg-red-600 hover:text-white"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      {/* ===== Images ===== */}
      <div className="relative h-48 bg-gray-900">
        {/* Poster */}
        <div className="absolute top-3 left-3 w-20 h-32 rounded-lg overflow-hidden
                        border-2 border-amber-600 shadow-lg z-10 bg-gray-900">
          {movie.image1 ? (
            <img src={movie.image1} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-amber-600">
              No Image
            </div>
          )}
        </div>

        {/* Banner */}
        {movie.image2 ? (
          <img src={movie.image2} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-600">
            No Banner
          </div>
        )}
      </div>

      {/* ===== Info ===== */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {movie.description}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
