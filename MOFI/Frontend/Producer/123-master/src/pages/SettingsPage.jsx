// src/pages/SettingsPage.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  {user?.profile_pic ? (
                    <img src={user.profile_pic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {user?.first_name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-white font-semibold">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-gray-400 text-sm">{user?.professionalName}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings/change-password"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Password</span>
                </Link>

                <Link
                  to="/settings/delete-account"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Account</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;