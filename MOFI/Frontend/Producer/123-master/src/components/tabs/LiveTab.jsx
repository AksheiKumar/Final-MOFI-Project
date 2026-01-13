function LiveTab({ liveStreams, movieId, onDelete, onShowModal, hasLivePermission }) {
  const handleDelete = (liveId) => {
    if (window.confirm("Are you sure you want to delete this live session?")) {
      if (onDelete) onDelete(liveId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Live Schedule</h2>
        {hasLivePermission && onShowModal && (
          <button
            onClick={() => onShowModal('live')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span> Add Live</span>
          </button>
        )}
      </div>

      {liveStreams && liveStreams.length > 0 ? (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Description</th>
                {hasLivePermission && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {liveStreams.map((live) => (
                <tr key={live.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{live.title}</td>
                  <td className="px-6 py-4 text-gray-300">{live.date}</td>
                  <td className="px-6 py-4 text-gray-300">{live.time}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {live.description}
                  </td>
                  {hasLivePermission && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(live.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-900/20 rounded"
                        title="Delete live session"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
          <div className="bg-gradient-to-br from-red-900/20 to-red-900/20 rounded-full p-8 mb-6">
            <svg className="w-16 h-16 text-red-500/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <p className="text-zinc-300 text-xl mb-2">No live sessions scheduled</p>
          <p className="text-zinc-500 text-sm">Schedule your first live stream</p>
          {hasLivePermission && onShowModal && (
            <button
              onClick={() => onShowModal('live')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl"
            >
              + Add Live
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default LiveTab;