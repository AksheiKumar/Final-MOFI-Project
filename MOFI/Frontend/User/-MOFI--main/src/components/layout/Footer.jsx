// components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 border-t border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-lg">
                                <span className="text-white font-bold text-lg">FI</span>
                            </div>
                            <span className="text-xl md:text-2xl font-bold">
                                Mo<span className="text-amber-500">Fi</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Your ultimate destination for movies, TV series, and anime streaming.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-amber-500 transition-colors">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-amber-500 transition-colors">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-amber-500 transition-colors">
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-amber-500 transition-colors">
                                <FiYoutube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Browse Section */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Browse</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/tv-series" className="hover:text-amber-500 transition-colors">
                                    TV Series
                                </Link>
                            </li>
                            <li>
                                <Link to="/movies" className="hover:text-amber-500 transition-colors">
                                    Movies
                                </Link>
                            </li>
                            <li>
                                <Link to="/animes" className="hover:text-amber-500 transition-colors">
                                    Animes
                                </Link>
                            </li>
                            <li>
                                <Link to="/coming-soon" className="hover:text-amber-500 transition-colors">
                                    Coming Soon
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community Section */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Community</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/community" className="hover:text-amber-500 transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link to="/friends" className="hover:text-amber-500 transition-colors">
                                    Friends
                                </Link>
                            </li>
                            <li>
                                <Link to="/parties" className="hover:text-amber-500 transition-colors">
                                    Parties
                                </Link>
                            </li>
                            <li>
                                <Link to="/discovery" className="hover:text-amber-500 transition-colors">
                                    Discovery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help & Support Section */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Help & Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/settings" className="hover:text-amber-500 transition-colors">
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-500 transition-colors">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-500 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1">
                                    <FiMail className="w-4 h-4" />
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} MoFi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
