import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Projects() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const projects = [
    { id: 1, title: "Summer Blockbuster 2025", status: "In Production", budget: "$50M" },
    { id: 2, title: "Indie Drama Series", status: "Pre-Production", budget: "$5M" },
    { id: 3, title: "Documentary Film", status: "Post-Production", budget: "$2M" },
  ];

  return (
    <>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">My Projects</h1>
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-amber-600 transition-colors shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">{project.title}</h3>
                    <p className="text-amber-600 text-sm sm:text-base">{project.status}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-gray-400 text-xs sm:text-sm">Budget</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{project.budget}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
