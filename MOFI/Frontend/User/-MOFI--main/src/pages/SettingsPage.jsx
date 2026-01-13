// components/pages/SettingsPage.jsx

import React, { useState } from 'react';
import { 
    FiMail, 
    FiLock, 
    FiBell, 
    FiGlobe,
    FiMonitor, 
    FiEdit3,
    FiToggleLeft,
    FiToggleRight,
    FiSave,
    FiCheck
} from 'react-icons/fi';

const SETTINGS_DATA = {
    fullName: "Inshira Fathi",
    email: "fathimainshira2002@gmai.com",
    username: "Inshira2021",
    language: "English",
    theme: "Dark Mode",
    notifications: {
        email: true,
        push: true,
        newReleases: true,
        recommendations: false,
    },
    privacy: {
        profilePublic: true,
        showWatchHistory: false,
        allowComments: true,
    },
    playback: {
        autoplay: true,
        quality: "Auto",
        subtitles: "English",
    }
};

const SettingsPage = () => {
    const [settings, setSettings] = useState(SETTINGS_DATA);
    const [saved, setSaved] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: SETTINGS_DATA.fullName,
        email: SETTINGS_DATA.email,
        username: SETTINGS_DATA.username,
        language: SETTINGS_DATA.language,
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const handleSave = () => {
        // Save all settings
        console.log('Saving settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        setEditForm({
            fullName: settings.fullName,
            email: settings.email,
            username: settings.username,
            language: settings.language,
        });
    };

    const handleSaveProfile = () => {
        setSettings(prev => ({
            ...prev,
            fullName: editForm.fullName,
            email: editForm.email,
            username: editForm.username,
            language: editForm.language,
        }));
        setIsEditingProfile(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleEditFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = () => {
        if (passwordForm.new !== passwordForm.confirm) {
            alert('New passwords do not match!');
            return;
        }
        if (passwordForm.new.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }
        console.log('Changing password...');
        setShowPasswordModal(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex-grow overflow-y-auto pr-0 lg:pr-4 px-4 lg:px-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 mt-4 text-white">
                Settings
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* --- Left Column: Account Info --- */}
                <div className="lg:w-1/3 space-y-6 md:space-y-8">
                    
                    {/* Account Card */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-4 md:p-6 relative ring-2 ring-amber-600/20">
                        
                        {/* Edit Button */}
                        <button 
                            onClick={handleEditProfile}
                            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-amber-500 transition"
                        >
                            <FiEdit3 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {isEditingProfile ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-amber-600 mb-3 shadow-lg shadow-amber-900/50">
                                        {editForm.fullName.charAt(0)}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.fullName}
                                        onChange={(e) => handleEditFormChange('fullName', e.target.value)}
                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Username</label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => handleEditFormChange('username', e.target.value)}
                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => handleEditFormChange('email', e.target.value)}
                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Language</label>
                                    <select
                                        value={editForm.language}
                                        onChange={(e) => handleEditFormChange('language', e.target.value)}
                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    >
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-amber-600 mb-3 md:mb-4 shadow-lg shadow-amber-900/50">
                                        {settings.fullName.charAt(0)}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white">{settings.fullName}</h3>
                                    <p className="text-amber-400 text-sm md:text-md font-medium">@{settings.username}</p>
                                </div>
                                
                                <div className="mt-4 md:mt-6 pt-4 border-t border-gray-700 space-y-2 text-xs md:text-sm">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <FiMail className="w-4 h-4 text-amber-600" />
                                        <span>{settings.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <FiGlobe className="w-4 h-4 text-amber-600" />
                                        <span>Language: {settings.language}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <FiMonitor className="w-4 h-4 text-amber-600" />
                                        <span>Theme: {settings.theme}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
                        <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Quick Actions</h4>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition text-left"
                            >
                                <FiLock className="w-4 h-4 text-amber-600" />
                                <span className="text-sm">Change Password</span>
                            </button>
                            <button 
                                onClick={handleSave}
                                className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition text-left"
                            >
                                <FiBell className="w-4 h-4 text-amber-600" />
                                <span className="text-sm">Save All Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* --- Right Column: Settings Options --- */}
                <div className="lg:w-2/3 space-y-6 md:space-y-8">
                    
                    {/* Notifications Settings */}
                    <SettingsSection title="Notifications">
                        <SettingToggle 
                            label="Email Notifications" 
                            description="Receive updates via email"
                            checked={settings.notifications.email}
                            onChange={() => handleToggle('notifications', 'email')}
                        />
                        <SettingToggle 
                            label="Push Notifications" 
                            description="Get instant alerts on your device"
                            checked={settings.notifications.push}
                            onChange={() => handleToggle('notifications', 'push')}
                        />
                        <SettingToggle 
                            label="New Releases" 
                            description="Notify about new movies & series"
                            checked={settings.notifications.newReleases}
                            onChange={() => handleToggle('notifications', 'newReleases')}
                        />
                        <SettingToggle 
                            label="Recommendations" 
                            description="Get personalized content suggestions"
                            checked={settings.notifications.recommendations}
                            onChange={() => handleToggle('notifications', 'recommendations')}
                        />
                    </SettingsSection>

                    {/* Privacy Settings */}
                    <SettingsSection title="Privacy & Security">
                        <SettingToggle 
                            label="Public Profile" 
                            description="Allow others to view your profile"
                            checked={settings.privacy.profilePublic}
                            onChange={() => handleToggle('privacy', 'profilePublic')}
                        />
                        <SettingToggle 
                            label="Show Watch History" 
                            description="Display your viewing activity"
                            checked={settings.privacy.showWatchHistory}
                            onChange={() => handleToggle('privacy', 'showWatchHistory')}
                        />
                        <SettingToggle 
                            label="Allow Comments" 
                            description="Let others comment on your reviews"
                            checked={settings.privacy.allowComments}
                            onChange={() => handleToggle('privacy', 'allowComments')}
                        />
                    </SettingsSection>

                    {/* Playback Settings */}
                    <SettingsSection title="Playback Preferences">
                        <SettingToggle 
                            label="Autoplay" 
                            description="Automatically play next episode"
                            checked={settings.playback.autoplay}
                            onChange={() => handleToggle('playback', 'autoplay')}
                        />
                        <SettingItem 
                            label="Video Quality" 
                            description="Preferred streaming quality"
                            value={settings.playback.quality}
                        />
                        <SettingItem 
                            label="Subtitles" 
                            description="Default subtitle language"
                            value={settings.playback.subtitles}
                        />
                    </SettingsSection>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-amber-900/50"
                        >
                            {saved ? (
                                <>
                                    <FiCheck className="w-5 h-5" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
                    <div className="bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Change Password</h3>
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Enter current password"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.new}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Enter new password"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePasswordChange}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-3 rounded-lg font-semibold transition"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Settings Section Component
const SettingsSection = ({ title, children }) => (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-600 mr-3 rounded-full"></span>
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// Setting Toggle Component
const SettingToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition">
        <div className="flex-1">
            <p className="text-white font-medium text-sm md:text-base">{label}</p>
            <p className="text-gray-400 text-xs md:text-sm">{description}</p>
        </div>
        <button 
            onClick={onChange}
            className="ml-4"
        >
            {checked ? (
                <FiToggleRight className="w-10 h-10 text-amber-600" />
            ) : (
                <FiToggleLeft className="w-10 h-10 text-gray-600" />
            )}
        </button>
    </div>
);

// Setting Item Component (read-only display)
const SettingItem = ({ label, description, value }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition">
        <div className="flex-1">
            <p className="text-white font-medium text-sm md:text-base">{label}</p>
            <p className="text-gray-400 text-xs md:text-sm">{description}</p>
        </div>
        <span className="ml-4 text-amber-500 font-semibold">{value}</span>
    </div>
);

export default SettingsPage;
