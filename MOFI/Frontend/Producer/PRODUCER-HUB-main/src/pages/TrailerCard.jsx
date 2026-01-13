import { useNavigate } from "react-router-dom";
import api from "../services/api";
function TrailerCard({ trailer, movieId, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(trailer.trailer_id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}/add-trailer?id=${trailer.trailer_id}`);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movieId}/trailer/${trailer.trailer_id}`);
  };


  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-zinc-800/90 to-black/90 rounded-xl overflow-hidden border border-zinc-700 hover:border-amber-500 transition cursor-pointer"
    >
      <div className="flex items-stretch">
        {/* Thumbnail */}
        <div className="relative w-80 aspect-video bg-black">
          {trailer.thumbnail_url ? (
            <img
              src={trailer.thumbnail_url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Thumbnail
            </div>
          )}

          {/* Icons */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={handleEdit}
              className="p-3 bg-orange-600 rounded-lg"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="p-3 bg-red-600 rounded-lg"
            > 
              🗑️
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className="text-xl font-bold text-amber-50">
            {trailer.trailer_name}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default TrailerCard;
