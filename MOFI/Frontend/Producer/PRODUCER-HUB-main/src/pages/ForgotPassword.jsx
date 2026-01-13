import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset:', formData);
    // Simulate successful password reset
    alert('Password reset successful!');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { 
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=90', 
      title: 'Reset Your<br />Password', 
      subtitle: 'Secure your account and get back to creating amazing films' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=90', 
      title: 'Keep Your Account<br />Safe', 
      subtitle: 'Your security is our priority' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=90', 
      title: 'Back to Creating<br />in Minutes', 
      subtitle: 'Reset your password and continue your journey' 
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
      <div className="flex min-h-[80vh] w-full max-w-5xl bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 relative z-10">
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
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 w-full">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: slides[activeSlide].title }}>
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-md">
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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative">
          {/* Background Image with transparency */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1574267432644-f610f5b7c18f?w=1200&q=90')",
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-orange-900/70 backdrop-blur-sm"></div>
          
          <div className="w-full max-w-sm relative z-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Reset Password
              </h1>
              <p className="text-amber-200/90 text-sm">Enter your details to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-amber-100 mb-2"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
              </div>

              {/* New Password Field */}
              <div>
                <label 
                  htmlFor="newPassword" 
                  className="block text-sm font-medium text-amber-100 mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
                <p className="text-xs text-amber-300/60 mt-1.5">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-amber-100 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
              </div>

              {/* Save Password Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] text-base mt-8"
              >
                Save Password
              </button>

              {/* Back to Login Link */}
              <p className="text-center text-sm text-amber-200/80 mt-6">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-amber-100 font-semibold hover:text-white transition-colors"
                >
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
