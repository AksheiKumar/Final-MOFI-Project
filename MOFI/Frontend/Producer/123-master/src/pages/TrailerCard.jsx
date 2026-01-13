import { useNavigate } from "react-router-dom";

function TrailerCard({ trailer, movieId, onDelete, hasVideoPermission }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (hasVideoPermission && onDelete) {
      onDelete(trailer.trailer_id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (hasVideoPermission) {
      navigate(`/movie/${movieId}/add-trailer?id=${trailer.trailer_id}`);
    }
  };

  const handleCardClick = () => {
    // Anyone can view trailer details, but editing requires permission
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
              alt={trailer.trailer_name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Thumbnail
            </div>
          )}

          {/* Action Buttons - Only show if user has video permission */}
          {hasVideoPermission && (
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={handleEdit}
                className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                title="Edit trailer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                title="Delete trailer"
              > 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className="text-xl font-bold text-amber-50">
            {trailer.trailer_name}
          </h3>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Status:</span>
              <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">
                {hasVideoPermission ? "Can Edit" : "View Only"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrailerCard;