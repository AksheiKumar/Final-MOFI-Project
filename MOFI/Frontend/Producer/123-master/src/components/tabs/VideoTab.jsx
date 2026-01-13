import { useNavigate } from 'react-router-dom';
import TrailerCard from '../../pages/TrailerCard';

function VideoTab({ trailers, movieId, onDelete, onNavigateAddTrailer, hasVideoPermission }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Videos & Trailers</h2>
        {hasVideoPermission && onNavigateAddTrailer && (
          <button
            onClick={onNavigateAddTrailer}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span> Add Video</span>
          </button>
        )}
      </div>

      {trailers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {trailers.map((trailer) => (
            <TrailerCard
              key={trailer.trailer_id}
              trailer={trailer}
              movieId={movieId}
              onDelete={onDelete}
              hasVideoPermission={hasVideoPermission}
            />                
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
            <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-300 text-xl mb-2">No videos yet</p>
          <p className="text-zinc-500 text-sm">Add your first video or trailer</p>
          {hasVideoPermission && onNavigateAddTrailer && (
            <button
              onClick={onNavigateAddTrailer}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl"
            >
              + Add Video
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoTab;