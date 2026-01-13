import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TrailerCard from './TrailerCard';
import HorizontalTabs from '../components/HorizontalTabs';
import VideoTab from '../components/tabs/VideoTab';
import ImageTab from '../components/tabs/ImageTab';
import LiveTab from '../components/tabs/LiveTab';
import CrewTab from '../components/tabs/CrewTab';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [activeTab, setActiveTab] = useState('video');
  const [images, setImages] = useState([]);
  const [liveMovies, setLiveMovies] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', description: '', file: null, preview: '' });
  const [newLiveMovie, setNewLiveMovie] = useState({ title: '', date: '', time: '', description: '' });
  const [newCrewMember, setNewCrewMember] = useState({ linkedinId: '', contribution: '' });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch movie details only
        const movieRes = await axios.get(
          `http://127.0.0.1:8080/movies/movie_details/${id}`
        );

        const m = movieRes.data;

        setMovie({
          movie_id: m.movie_id,
          imdbID: m.imdbID,
          type: m.type,
          title: m.title,
          description: m.description,
          directors: m.directors,
          writers: m.writers,
          genres: m.genres,
          release_date: m.release_date,
          duration: m.duration,
          mainImage: m.image1,
          bannerImage: m.image2
        });

        // Fetch trailers (videos tab)
        try {
          const trailerRes = await axios.get(
            `http://127.0.0.1:8080/trailers/movie/${id}`
          );
          setTrailers(trailerRes.data || []);
        } catch (err) {
          console.log('No trailers found');
          setTrailers([]);
        }

      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDeleteTrailer = async (trailerId) => {
    if (!window.confirm("Are you sure you want to delete this trailer?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8080/trailers/${trailerId}`, {
        withCredentials: true,
      });

      setTrailers((prev) => prev.filter((t) => t.trailer_id !== trailerId));
      alert("Trailer deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete trailer");
    }
  };

  const fetchTrailers = async () => {
    try {
      const trailerRes = await axios.get(
        `http://127.0.0.1:8080/trailers/movie/${id}`
      );
      setTrailers(trailerRes.data || []);
    } catch (err) {
      console.log('No trailers found');
      setTrailers([]);
    }
  };

  const fetchImages = async () => {
    try {
      const imagesRes = await axios.get(
        `http://127.0.0.1:8080/images/movie/${id}`
      );
      setImages(imagesRes.data || []);
    } catch (err) {
      console.log('No images found');
      setImages([]);
    }
  };

  const fetchCrew = async () => {
    try {
      const crewRes = await axios.get(
        `http://127.0.0.1:8080/crew/movie/${id}`
      );
      setCrewMembers(crewRes.data || []);
    } catch (err) {
      console.log('No crew found');
      setCrewMembers([]);
    }
  };

  const fetchLive = async () => {
    try {
      const liveRes = await axios.get(
        `http://127.0.0.1:8080/live/movie/${id}`
      );
      setLiveMovies(liveRes.data || []);
    } catch (err) {
      console.log('No live data found');
      setLiveMovies([]);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, file: file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImage.title && newImage.preview) {
      const imageToAdd = { 
        id: Date.now(), 
        title: newImage.title, 
        description: newImage.description,
        url: newImage.preview 
      };
      const updatedImages = [...images, imageToAdd];
      setImages(updatedImages);
      setNewImage({ title: '', description: '', file: null, preview: '' });
      setShowImageModal(false);
    }
  };

  const handleDeleteImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
  };

  const handleAddLiveMovie = (e) => {
    e.preventDefault();
    if (newLiveMovie.title && newLiveMovie.date && newLiveMovie.time && newLiveMovie.description) {
      const liveToAdd = { ...newLiveMovie, id: Date.now() };
      const updatedLive = [...liveMovies, liveToAdd];
      setLiveMovies(updatedLive);
      setNewLiveMovie({ title: '', date: '', time: '', description: '' });
      setShowLiveModal(false);
    }
  };

  const handleDeleteLive = (liveId) => {
    const updatedLive = liveMovies.filter(live => live.id !== liveId);
    setLiveMovies(updatedLive);
  };

  const handleAddCrewMember = (e) => {
    e.preventDefault();
    if (newCrewMember.linkedinId && newCrewMember.contribution) {
      const memberToAdd = { ...newCrewMember, id: Date.now() };
      const updatedCrew = [...crewMembers, memberToAdd];
      setCrewMembers(updatedCrew);
      setNewCrewMember({ linkedinId: '', contribution: '' });
      setShowCrewModal(false);
    }
  };

  const handleDeleteCrew = (crewId) => {
    const updatedCrew = crewMembers.filter(crew => crew.id !== crewId);
    setCrewMembers(updatedCrew);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-800/50 mb-6 transition-all duration-200"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          {/* ================= MOVIE HEADER ================= */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl mb-8">
            <div className="relative">
              {/* Banner Image */}
              <div className="relative h-80 sm:h-96">
                {movie.bannerImage ? (
                  <img src={movie.bannerImage} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-24 h-24 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Main Image Overlay */}
                <div className="absolute bottom-6 left-6 w-32 h-48 rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-gray-900">
                  {movie.mainImage ? (
                    <img src={movie.mainImage} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Movie Title */}
                <div className="absolute bottom-6 left-44 right-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {movie.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs Navigation */}
          <HorizontalTabs 
            activeTab={activeTab} 
            setActiveTab={(tabId) => {
              setActiveTab(tabId);
              // Lazy load data when tab is clicked
              if (tabId === 'image' && images.length === 0) fetchImages();
              if (tabId === 'live' && liveMovies.length === 0) fetchLive();
              if (tabId === 'crew' && crewMembers.length === 0) fetchCrew();
            }}
            tabs={[
              { id: 'video', label: 'Video' },
              { id: 'image', label: 'Images' },
              { id: 'live', label: 'Live' },
              { id: 'crew', label: 'Crew' }
            ]}
          />

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Video Tab */}
            {activeTab === 'video' && (
              <VideoTab 
                trailers={trailers} 
                movie={movie} 
                onDelete={handleDeleteTrailer}
                onRefresh={fetchTrailers}
              />
            )}

            {/* Images Tab */}
            {activeTab === 'image' && (
              <ImageTab 
                images={images} 
                movie={movie} 
                onDelete={handleDeleteImage}
                onShowModal={setShowImageModal}
              />
            )}

            {/* Live Tab */}
            {activeTab === 'live' && (
              <LiveTab 
                liveMovies={liveMovies} 
                onDelete={handleDeleteLive}
                onShowModal={setShowLiveModal}
              />
            )}

            {/* Crew Tab */}
            {activeTab === 'crew' && (
              <CrewTab 
                crewMembers={crewMembers} 
                onDelete={handleDeleteCrew}
                onShowModal={setShowCrewModal}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Image</h3>
              <button
                onClick={() => {
                  setNewImage({ title: '', description: '', file: null, preview: '' });
                  setShowImageModal(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddImage}>
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload Image</span>
                  </span>
                </label>
                
                <div className="relative">
                  {newImage.preview ? (
                    <div className="relative group">
                      <img
                        src={newImage.preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <label className="cursor-pointer px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all">
                          <span>Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-amber-500 transition-colors bg-gray-900/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold text-amber-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Title</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Enter image title"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors placeholder-gray-500"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Description (Optional)</span>
                  </span>
                </label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Enter image description"
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors placeholder-gray-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!newImage.preview || !newImage.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewImage({ title: '', description: '', file: null, preview: '' });
                    setShowImageModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Live Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Schedule Live Session</h3>
            <form onSubmit={handleAddLiveMovie}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={newLiveMovie.title}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={newLiveMovie.date}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Time</label>
                <input
                  type="time"
                  value={newLiveMovie.time}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, time: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Description</label>
                <textarea
                  value={newLiveMovie.description}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter live session description"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowLiveModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Crew Modal */}
      {showCrewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Add Crew Member</h3>
            <form onSubmit={handleAddCrewMember}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">LinkedIn ID</label>
                <input
                  type="text"
                  value={newCrewMember.linkedinId}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, linkedinId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., john-doe-123456"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Contribution</label>
                <textarea
                  value={newCrewMember.contribution}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, contribution: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Describe their contribution to the project"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCrewMember({ linkedinId: '', contribution: '' });
                    setShowCrewModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
