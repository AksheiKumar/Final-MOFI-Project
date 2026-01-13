import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 shadow-2xl`}
    >
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-amber-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/projects"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/projects')
              ? 'bg-amber-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium">Projects</span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-amber-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
