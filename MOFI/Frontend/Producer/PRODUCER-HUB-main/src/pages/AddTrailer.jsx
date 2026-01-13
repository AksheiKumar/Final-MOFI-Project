import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from "../auth/AuthContext";
import axios from 'axios';

function AddTrailer() {
  const { user } = useAuth();
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trailerId = searchParams.get('id');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // ================== FETCH TRAILER DATA IF EDIT ==================
  useEffect(() => {
    if (!trailerId) return;

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8080/trailers/${trailerId}`);
        const t = res.data;

        setFormData({ title: t.trailer_name, description: t.description || '' });
        setThumbnailPreview(t.thumbnail_url || null);
        setVideoPreview(t.video_url || null);
      } catch (err) {
        console.error(err);
        alert("Failed to load trailer data");
        navigate(`/movie/${movieId}`);
      }
    };

    fetchTrailer();
  }, [trailerId, navigate, movieId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // ================== SUBMIT HANDLER ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!user?.id) {
      alert("Not authenticated");
      setIsSubmitting(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("trailer_name", formData.title);
      form.append("movie_id", movieId);

      // Only append files if user changed them
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);
      if (videoFile) form.append("video", videoFile);

      if (trailerId) {
        // EDIT trailer
        await axios.put(`http://127.0.0.1:8080/trailers/${trailerId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trailer updated successfully");
      } else {
        // ADD trailer
        if (!thumbnailFile || !videoFile) {
          alert("Please upload both thumbnail and video for new trailer");
          setIsSubmitting(false);
          return;
        }
        await axios.post("http://127.0.0.1:8080/trailers/create", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trailer created successfully");
      }

      navigate(`/movie/${movieId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save trailer");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(`/movie/${movieId}`)}
            className="mb-6 text-gray-400 hover:text-amber-600"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-amber-400 mb-6">
            {trailerId ? "Edit Trailer" : "Add Trailer"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-800 p-6 rounded-xl">
            {/* Thumbnail */}
            <div>
              <label className="text-amber-100 mb-2 block">Thumbnail</label>
              <div
                onClick={() => !isSubmitting && thumbnailInputRef.current?.click()}
                className={`h-52 border-2 border-amber-600 rounded-xl cursor-pointer overflow-hidden ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-center mt-20 text-amber-400">Click to upload</p>
                )}
              </div>
              <input
                type="file"
                ref={thumbnailInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>

            {/* Video */}
            <div>
              <label className="text-amber-100 mb-2 block">Video</label>
              <div
                onClick={() => !isSubmitting && videoInputRef.current?.click()}
                className={`h-52 border-2 border-amber-600 rounded-xl cursor-pointer overflow-hidden ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <p className="text-center mt-20 text-amber-400">Click to upload</p>
                )}
              </div>
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>

            {/* Title & Description */}
            <input
              name="title"
              placeholder="Trailer title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-md"
              required
              disabled={isSubmitting}
            />

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl text-white ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {isSubmitting ? "Saving..." : trailerId ? "Save Changes" : "Save Trailer"}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/movie/${movieId}`)}
                className="px-6 py-3 bg-gray-500 rounded-xl text-white hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddTrailer;
