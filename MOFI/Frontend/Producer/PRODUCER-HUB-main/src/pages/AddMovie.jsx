import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AddMovie() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { id } = useParams(); // movie_id (edit mode if exists)
const isEditMode = Boolean(id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    imdbID: "",
    type: "",
    title: "",
    description: "",
    directors: "",
    writers: "",
    genres: "",
    release_date: "",
    duration: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const mainImageRef = useRef(null);
  const bannerImageRef = useRef(null);

  /* ---------------- handlers ---------------- */

  useEffect(() => {
  if (!isEditMode) return;

  const fetchMovie = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8080/movies/movie_details/${id}`
      );

      const m = res.data;

      setFormData({
        imdbID: m.imdbID,
        type: m.type,
        title: m.title,
        description: m.description,
        directors: m.directors.join(","),
        writers: m.writers.join(","),
        genres: m.genres.join(","),
        release_date: m.release_date.split("T")[0],
        duration: m.duration,
      });

      // Show existing images as preview
      setMainPreview(m.image1);
      setBannerPreview(m.image2);
    } catch (err) {
      alert("Failed to load movie");
      navigate("/dashboard");
    }
  };

  fetchMovie();
}, [id]);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const previewImage = (file, setFile, setPreview) => {
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  setIsSubmitting(true);

  const fd = new FormData();

  if (!isEditMode) {
    fd.append("user_id", user.id);
  }

  Object.entries(formData).forEach(([k, v]) =>
    fd.append(k, k === "release_date" ? new Date(v).toISOString() : v)
  );

  if (mainImage) fd.append("image1", mainImage);
  if (bannerImage) fd.append("image2", bannerImage);

  try {
    if (isEditMode) {
      await axios.put(
        `http://127.0.0.1:8080/moviesupdate/${id}`,
        fd
      );
      alert("Movie updated successfully");
    } else {
      await axios.post("http://127.0.0.1:8080/movies", fd);
      alert("Movie created successfully");
    }

    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.detail || "Failed");
  } finally {
    setIsSubmitting(false);
  }
};

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/producer.avif')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-orange-950/70 to-amber-900/80"></div>
      </div>

      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">
            {isEditMode ? "Edit Movie" : "Add New Movie"}
          </h1>


          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Images */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main */}
                <div onClick={() => mainImageRef.current.click()}
                  className="h-40 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer overflow-hidden">
                  {mainPreview ? (
                    <img src={mainPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      Upload Main Image
                    </div>
                  )}
                </div>
                <input hidden ref={mainImageRef} type="file" accept="image/*"
                  onChange={(e) => previewImage(e.target.files[0], setMainImage, setMainPreview)} />

                {/* Banner */}
                <div onClick={() => bannerImageRef.current.click()}
                  className="lg:col-span-2 h-40 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer overflow-hidden">
                  {bannerPreview ? (
                    <img src={bannerPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      Upload Banner Image
                    </div>
                  )}
                </div>
                <input hidden ref={bannerImageRef} type="file" accept="image/*"
                  onChange={(e) => previewImage(e.target.files[0], setBannerImage, setBannerPreview)} />
              </div>

              {[
                ["type", "Movie Type"],
                ["title", "Movie Title"],
                ["imdbID", "IMDB ID"],
                ["genres", "Genres"],
                ["writers", "Writers"],
                ["directors", "Directors"],
              ].map(([name, label]) => (
                <input
                  key={name}
                  name={name}
                  placeholder={label}
                  value={formData[name]}     // ✅ ADD THIS
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-amber-700 text-white"
                />
              ))}


              <textarea
                name="description"
                value={formData.description}   
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-transparent border-2 border-amber-700 rounded-lg text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  name="duration"
                  value={formData.duration}     // ✅
                  onChange={handleChange}
                  className="px-4 py-3 bg-transparent border-b-2 border-amber-700 text-white"
                />
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date} // ✅
                  onChange={handleChange}
                  className="px-4 py-3 bg-transparent border-b-2 border-amber-700 text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 ">
                <button type="submit" className="px-6 py-3 bg-gray-700 text-white rounded-lg
                            hover:bg-gray-600" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Update Movie"
                      : "Save Movie"}
                    
                </button>
              </div>
              <div className="flex gap-4 pt-4">
                 <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg
                            hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
