import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    contact: "",
    dob: "",
    nic_number: "",
    street_address: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    professionalName: "",
    profile_pic: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_pic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) fd.append(key, value);
    });

    try {
      await api.post("/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registered successfully! Check your email.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { 
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=90', 
      title: 'Capturing Moments,<br />Creating Memories', 
      subtitle: 'Join our community of film producers and bring your vision to life' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=90', 
      title: 'Lights, Camera,<br />Action!', 
      subtitle: 'Create cinematic masterpieces with cutting-edge production tools' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=90', 
      title: 'Your Story,<br />Our Platform', 
      subtitle: 'Showcase your films and connect with industry professionals' 
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Animated gradient orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Split Screen Layout with rounded corners */}
      <div className="flex min-h-[95vh] w-full max-w-7xl bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 relative z-10">
        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('${slides[activeSlide].image}')`,
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: slides[activeSlide].title }}>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-md">
              {slides[activeSlide].subtitle}
            </p>
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideClick(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-12 bg-white' : 'w-12 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
          {/* Background Image with transparency */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1574267432644-f610f5b7c18f?w=1200&q=90')",
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-orange-900/70 backdrop-blur-sm"></div>
          
          <div className="w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto pr-2" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#000000 rgba(17, 24, 39, 0.5)'
          }}>
            <style>{`
              .w-full.max-w-xl::-webkit-scrollbar {
                width: 8px;
              }
              .w-full.max-w-xl::-webkit-scrollbar-track {
                background: rgba(17, 24, 39, 0.5);
                border-radius: 10px;
              }
              .w-full.max-w-xl::-webkit-scrollbar-thumb {
                background: #000000;
                border-radius: 10px;
              }
              .w-full.max-w-xl::-webkit-scrollbar-thumb:hover {
                background: #1a1a1a;
              }
            `}</style>
            {/* Header */}
            <div className="mb-8 sticky top-0 bg-gradient-to-b from-gray-900/95 to-transparent pb-4 z-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Create an account
              </h1>
              <p className="text-amber-200/90 mt-2 text-sm">Join our creative community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
                <div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
              </div>

              

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Contact number"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
                <div>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="Date of birth"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    style={{ colorScheme: 'dark' }}
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  id="nic_number"
                  name="nic_number"
                  type="text"
                  value={formData.nic_number}
                  onChange={handleChange}
                  placeholder="NIC Number"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div>
                <input
                  id="street_address"
                  name="street_address"
                  type="text"
                  value={formData.street_address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
                <div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
                <div>
                  <input
                    id="postal"
                    name="postal"
                    type="text"
                    value={formData.postal}
                    onChange={handleChange}
                    placeholder="Postal"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                  required
                />
              </div>

              <div>
                <input
                  id="professionalName"
                  name="professionalName"
                  type="text"
                  value={formData.professionalName}
                  onChange={handleChange}
                  placeholder="Nickname "
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:bg-white/10 transition-all duration-300 text-sm hover:border-white/20 shadow-lg shadow-black/20"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-amber-100">Profile Picture</label>
                <input
                  id="profile_pic"
                  name="profile_pic"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-amber-700/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-amber-700 file:to-orange-700 file:text-white hover:file:from-amber-600 hover:file:to-orange-600 file:cursor-pointer file:transition-all file:shadow-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all text-sm hover:border-amber-600/50 shadow-lg shadow-black/20"
                />
                {formData.profile_pic && (
                  <img src={formData.profile_pic} alt="Profile preview" className="w-20 h-20 object-cover rounded-xl border-2 border-amber-500 shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform duration-300" />
                )}
              </div>

              

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-600/50 active:scale-[0.98] text-sm shadow-xl shadow-amber-900/40 relative overflow-hidden group"
              >
                <span className="relative z-10">Create account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

             
              {/* Already have account message */}
              <div className="text-center mt-6">
                <p className="text-sm text-amber-200/80">
                  Already have an account?{' '}
                  <Link to="/login" className="text-amber-100 font-semibold hover:text-white transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-amber-100 after:transition-all hover:after:w-full">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;