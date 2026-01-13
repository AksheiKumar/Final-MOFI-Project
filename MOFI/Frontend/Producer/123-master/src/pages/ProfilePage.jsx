import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext'; // Import useAuth

const ProfilePage = () => {
  const navigate = useNavigate();
  const { accessToken, setUser } = useAuth(); // Get accessToken from context
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact: '',
    dob: '',
    street_address: '',
    city: '',
    state: '',
    postal: '',
    country: '',
    professionalName: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8001/producer/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUserData(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        contact: response.data.contact || '',
        dob: response.data.dob ? response.data.dob.split('T')[0] : '',
        street_address: response.data.street_address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        postal: response.data.postal || '',
        country: response.data.country || '',
        professionalName: response.data.professionalName || '',
      });
      setImagePreview(response.data.profile_pic || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      
      if (profileImage) {
        formDataToSend.append('profile_pic', profileImage);
      }

      const response = await axios.put(
        'http://localhost:8001/producer/update/profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUserData(response.data.user);
      // Update user in AuthContext as well
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        first_name: response.data.user.first_name,
        professionalName: response.data.user.professionalName,
        profile_pic: response.data.user.profile_pic,
      });
      
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-600">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {userData?.first_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {editMode ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white px-3 py-1 rounded w-32"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white px-3 py-1 rounded w-32"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${userData?.first_name || ''} ${userData?.last_name || ''}`
                    )}
                  </h1>
                  <p className="text-gray-400">{userData?.professionalName}</p>
                  <p className="text-gray-400 text-sm mt-1">{userData?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${userData?.email_verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {userData?.email_verified ? '✓ Verified' : '✗ Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${editMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'} text-white transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Profile Form */}
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Professional Name</label>
                    <input
                      type="text"
                      name="professionalName"
                      value={formData.professionalName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter professional name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Contact Number</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">NIC Number</label>
                    <input
                      type="text"
                      value={userData?.nic_number || ''}
                      disabled
                      className="w-full bg-gray-900 text-gray-400 px-4 py-2 rounded-lg border border-gray-700 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">NIC number cannot be changed</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Contact Information</h3>
                    <p className="text-white">{userData?.contact || 'Not set'}</p>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Date of Birth</h3>
                    <p className="text-white">{formatDate(userData?.dob)}</p>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">NIC Number</h3>
                    <p className="text-white">{userData?.nic_number}</p>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Member Since</h3>
                    <p className="text-white">{formatDate(userData?.created_at)}</p>
                  </div>

                  <div className="md:col-span-2 bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Address</h3>
                    <p className="text-white">
                      {userData?.street_address || 'Not set'}<br />
                      {userData?.city && `${userData.city}, `}
                      {userData?.state && `${userData.state} `}
                      {userData?.postal}<br />
                      {userData?.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;