import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

const DeleteAccountPage = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [professionalName, setProfessionalName] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8001/producer/profile', {
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    }
  };

        const handleDeleteAccount = async () => {
        if (!professionalName.trim()) {
            toast.error('Please enter your professional name');
            return;
        }

        if (professionalName !== userData?.professionalName) {
            toast.error('Professional name does not match');
            return;
        }

        setLoading(true);
        try {
            if (!accessToken) {
            toast.error('You need to be logged in');
            navigate('/login');
            return;
            }

            const response = await axios.delete(
            'http://localhost:8001/producer/delete-account',
            {
                headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                },
                data: { professional_name: professionalName }
            }
            );
            
            toast.success('Account deleted successfully');
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            if (error.response?.data?.detail) {
            toast.error(error.response.data.detail);
            } else {
            toast.error('Failed to delete account');
            }
            setLoading(false);
            setShowModal(false);
        }
        };
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Delete Account</h1>
            <p className="text-gray-400">Permanently delete your account and all associated data</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <h3 className="text-red-300 font-semibold text-lg mb-3">⚠️ Warning: This action cannot be undone</h3>
          <ul className="text-red-200 space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>All your personal information will be permanently deleted</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>All your projects and movies will be removed</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>You will be logged out immediately</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>This action is irreversible</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-medium mb-4">To confirm deletion:</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">
                Your professional name: <span className="text-amber-400 font-medium">{userData?.professionalName || 'Loading...'}</span>
              </label>
              <input
                type="text"
                value={professionalName}
                onChange={(e) => setProfessionalName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Type your professional name exactly as shown above"
              />
              <p className="text-gray-500 text-sm mt-2">
                You must type your professional name exactly as shown to confirm deletion.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowModal(true)}
            disabled={!professionalName}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Delete My Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-red-700 max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.954-.833-2.724 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Final Confirmation</h3>
                <p className="text-gray-400">Are you absolutely sure you want to delete your account?</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  Account: <span className="text-white font-medium">{userData?.email}</span><br />
                  Professional Name: <span className="text-white font-medium">{userData?.professionalName}</span>
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountPage;