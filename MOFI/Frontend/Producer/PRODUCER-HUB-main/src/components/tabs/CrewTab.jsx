function CrewTab({ crewMembers, onDelete, onShowModal }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Crew Members</h2>
        <button
          onClick={() => onShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      {crewMembers.length > 0 ? (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">LinkedIn ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Contribution</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {crewMembers.map((crew) => (
                <tr key={crew.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <a 
                      href={`https://www.linkedin.com/in/${crew.linkedinId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-medium"
                    >
                      {crew.linkedinId}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{crew.contribution}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(crew.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
            <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-zinc-300 text-xl mb-2">No crew members yet</p>
          <p className="text-zinc-500 text-sm">Add your first crew member</p>
        </div>
      )}
    </div>
  );
}

export default CrewTab;
