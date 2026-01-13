import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../auth/AuthContext";

export default function ProducerLogin() {
  const { setAccessToken, setUser, accessToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const slides = [
    { image: "https://source.unsplash.com/600x800/?music", title: "Welcome to MOFI", subtitle: "Manage your productions easily" },
    { image: "https://source.unsplash.com/600x800/?studio", title: "Organize Projects", subtitle: "Track all your work in one place" },
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideClick = (idx) => setActiveSlide(idx);

  useEffect(() => {
    if (accessToken) navigate("/dashboard");
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      setAccessToken(res.data.access);
      setUser(res.data.user);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">

      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="flex min-h-[80vh] w-full max-w-5xl bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 relative z-10">

        {/* Left Panel - Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url('${slides[activeSlide].image}')` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 w-full">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: slides[activeSlide].title }} />
            <p className="text-lg text-white/90 mb-6 max-w-md">{slides[activeSlide].subtitle}</p>
            <div className="flex space-x-2">
              {slides.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSlideClick(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-12 bg-white' : 'w-12 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-orange-900/70 backdrop-blur-sm"></div>

          <div className="w-full max-w-sm relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-amber-200/90 text-sm mb-6">Please enter your details.</p>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">E-mail</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-amber-200/90 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-amber-600 bg-amber-950/30 text-amber-600 focus:ring-2 focus:ring-amber-500 mr-2" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-amber-200 hover:text-amber-100">Forgot your password?</Link>
              </div>

              <button 
                type="submit"
                className={`w-full py-3.5 bg-gradient-to-r from-amber-700 to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

              <p className="text-center text-sm text-amber-200/80 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-100 font-semibold hover:text-white">Register here</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
