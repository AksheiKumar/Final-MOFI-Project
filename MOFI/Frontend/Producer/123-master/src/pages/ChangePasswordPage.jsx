import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth(); // Get accessToken from context
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

        const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (formData.new_password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            if (!accessToken) {
            toast.error('You need to be logged in');
            navigate('/login');
            return;
            }

            const response = await axios.post(
            'http://localhost:8001/producer/change-password', // This is correct
            formData,
            {
                headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                },
            }
            );
            
            toast.success('Password changed successfully!');
            setFormData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response?.data?.detail) {
            toast.error(error.response.data.detail);
            } else {
            toast.error('Failed to change password');
            }
        } finally {
            setLoading(false);
        }
        };
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Change Password</h1>
        <p className="text-gray-400">Update your password to keep your account secure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-gray-300 mb-2">Current Password</label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
            placeholder="Enter current password"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">New Password</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
            placeholder="Enter new password (min 6 characters)"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Confirm New Password</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;