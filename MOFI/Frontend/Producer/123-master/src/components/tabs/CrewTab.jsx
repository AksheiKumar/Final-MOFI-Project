function CrewTab({ crewMembers, onDelete, onShowModal, onEdit, hasCrewPermission, creatorLinkedinId, userAccessType }) {
  
  // Filter out the creator from the crew list
  // Also filter out any crew member with "Creator" contribution
  const filteredCrewMembers = crewMembers.filter(member => {
    // Check if this is the creator by LinkedIn ID
    const memberLinkedinId = member.linkedinId || member.linkedin_id;
    const isCreatorByLinkedinId = creatorLinkedinId && memberLinkedinId === creatorLinkedinId;
    
    // Check if this is the creator by contribution
    const isCreatorByContribution = member.contribution === "Creator" || member.is_creator;
    
    // Exclude if either is true
    return !(isCreatorByLinkedinId || isCreatorByContribution);
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Crew Members</h2>
        {hasCrewPermission && onShowModal && (
          <button
            onClick={() => onShowModal('crew')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span> Add Member</span>
          </button>
        )}
      </div>

      {/* Creator Info Section - Always visible at top */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Movie Owner</h3>
        <div className="p-4 bg-gradient-to-r from-green-900/10 to-emerald-900/10 border border-green-700/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold">Creator</h3>
                <p className="text-gray-300 text-sm">Has full access to all movie features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gradient-to-r from-green-700 to-emerald-700 text-white text-xs font-medium rounded-full">
                Full Permissions
              </span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full border border-gray-700">
                Cannot be removed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Crew Members Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Team Members</h3>
        <p className="text-gray-400 text-sm">Crew members with specific permissions</p>
      </div>

      {filteredCrewMembers && filteredCrewMembers.length > 0 ? (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">LinkedIn ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Contribution</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Permissions</th>
                {hasCrewPermission && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCrewMembers.map((crew) => {
                const linkedinId = crew.linkedinId || crew.linkedin_id;
                
                return (
                  <tr key={crew.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <a 
                        href={`https://www.linkedin.com/in/${linkedinId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline font-medium"
                      >
                        {linkedinId}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{crew.contribution}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {crew.permissions?.video && (
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">Video</span>
                        )}
                        {crew.permissions?.image && (
                          <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">Image</span>
                        )}
                        {crew.permissions?.live && (
                          <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded">Live</span>
                        )}
                        {crew.permissions?.scripts && (
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">Scripts</span>
                        )}
                        {crew.permissions?.crew && (
                          <span className="px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded">Crew</span>
                        )}
                      </div>
                    </td>
                    {hasCrewPermission && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {/* Edit Button */}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(crew)}
                              className="text-amber-500 hover:text-amber-400 transition-colors p-2 rounded hover:bg-amber-900/20"
                              title="Edit crew member"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Delete Button */}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(crew.id, crew)}
                              className="text-red-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-900/20"
                              title="Remove crew member"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
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
          <p className="text-zinc-300 text-xl mb-2">No team members yet</p>
          <p className="text-zinc-500 text-sm mb-4">Add your first crew member to collaborate</p>
          {hasCrewPermission && onShowModal && (
            <button
              onClick={() => onShowModal('crew')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl"
            >
              + Add Team Member
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CrewTab;