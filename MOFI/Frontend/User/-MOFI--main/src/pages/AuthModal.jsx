import { useState, Children, cloneElement, isValidElement } from "react";
import {
  FiX,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../auth/AuthContext";

export default function AuthModal({ onClose }) {
  const { login } = useAuth();

  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOGIN STATE ---------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ---------- SIGNUP STATE ---------- */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    dob: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  /* ---------- LOGIN ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      login(res.data.access, res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SIGNUP ---------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (imageFile) formData.append("file", imageFile);

      const res = await api.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Account created successfully");
      setIsSignIn(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- GOOGLE LOGIN ---------- */
  const handleGoogleLogin = async () => {
    try {
      const res = await api.get("/google/login");
      window.location.href = res.data.url; // redirect to Google OAuth
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-orange-900/70 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-gray-800/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-700/50 p-1 rounded-full mb-6">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 rounded-full font-semibold ${
              isSignIn
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                : "text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 rounded-full font-semibold ${
              !isSignIn
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                : "text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* LOGIN FORM */}
        {isSignIn && (
          <form onSubmit={handleLogin} className="space-y-5">
            <Input icon={<FiMail />} label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Input>

            <Input icon={<FiLock />} label="Password">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </Input>

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {!isSignIn && (
          <form onSubmit={handleSignup} className="space-y-4">
            {[
              ["first_name", "First Name", <FiUser />],
              ["last_name", "Last Name", <FiUser />],
              ["username", "Username", <FiUser />],
              ["dob", "Date of Birth", <FiCalendar />, "date"],
              ["email", "Email", <FiMail />, "email"],
              ["password", "Password", <FiLock />, "password"],
              ["confirm_password", "Confirm Password", <FiLock />, "password"],
            ].map(([name, label, icon, type]) => (
              <Input key={name} icon={icon} label={label}>
                <input
                  type={type || "text"}
                  name={name}
                  required
                  onChange={onChange}
                />
              </Input>
            ))}

            {/* Image */}
            <label className="block text-sm text-amber-100">
              Profile Picture (optional)
            </label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={handleImage} />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-16 h-16 rounded-full border border-amber-500"
                />
              )}
            </div>

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        {/* OR */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

/* ---------- REUSABLE INPUT ---------- */
function Input({ label, icon, children }) {
  const items = Children.toArray(children);
  const inputEl = items.find(
    (child) => isValidElement(child) && child.type === "input"
  );
  const others = items.filter((child) => child !== inputEl);

  return (
    <div>
      <label className="block text-sm text-amber-100 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-300">
          {icon}
        </span>
        {inputEl &&
          cloneElement(inputEl, {
            className:
              "w-full bg-transparent border-b border-amber-700 text-white py-2 pl-8 focus:outline-none",
          })}
        {others}
      </div>
    </div>
  );
}
