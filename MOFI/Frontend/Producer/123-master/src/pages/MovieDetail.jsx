import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TrailerCard from "../pages/TrailerCard";
import HorizontalTabs from "../components/HorizontalTabs";
import VideoTab from "../components/tabs/VideoTab";
import ImageTab from "../components/tabs/ImageTab";
import LiveTab from "../components/tabs/LiveTab";
import CrewTab from "../components/tabs/CrewTab";
import { useAuth } from "../auth/AuthContext";

function MovieDetail() {
  const { id } = useParams(); // backend movie_id
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [images, setImages] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userPermissions, setUserPermissions] = useState({
    video: false,
    image: false,
    live: false,
    scripts: false,
    crew: false
  });
  const [userAccessType, setUserAccessType] = useState("none");
  const [userContribution, setUserContribution] = useState("");
  
  // Image Modal States
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', description: '', file: null, preview: '', people: '' });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageDetail, setShowImageDetail] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  
  // Live Modal States
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [newLiveMovie, setNewLiveMovie] = useState({ title: '', date: '', time: '', description: '' });
  
  // Crew Modal States
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [editingCrewMember, setEditingCrewMember] = useState(null);
  const [newCrewMember, setNewCrewMember] = useState({
    linkedin_id: '',
    movie_data: {
      movie_id: id,
      contribution: '',
      permissions: {
        video: false,
        image: false,
        live: false,
        scripts: false,
        crew: false
      }
    }
  });

  /* ================= FETCH MOVIE & PERMISSIONS ================= */
  useEffect(() => {
    if (!id || !user?.id) return;

    const fetchData = async () => {
      try {
        // Fetch movie
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
          bannerImage: m.image2,
          user_id: m.user_id || null, 
        });

        // Fetch trailers
        const trailerRes = await axios.get(
          `http://127.0.0.1:8080/trailers/movie/${id}`
        );
        setTrailers(trailerRes.data || []);

        // Fetch images (if endpoint exists)
        try {
          const imageRes = await axios.get(
            `http://127.0.0.1:8080/movie-images/movie/image/${id}`
          );
          const mappedImages = imageRes.data.images.map(img => ({
            id: img.image_id,
            url: img.image_url,
            title: img.title,
            people: img.people,
            description: img.description
          }));
          setImages(mappedImages);
        } catch (err) {
          console.log("Images endpoint not available");
          setImages([]);
        }

        // Fetch live streams (if endpoint exists)
        try {
          const liveRes = await axios.get(
            `http://127.0.0.1:8080/live/movie/${id}`
          );
          setLiveStreams(liveRes.data || []);
        } catch (err) {
          console.log("Live streams endpoint not available");
          setLiveStreams([]);
        }

        // Fetch crew (if endpoint exists)
        try {
          const crewRes = await axios.get(
            `http://127.0.0.1:8001/crew/movie/${id}`
          );
          setCrew(crewRes.data || []);
        } catch (err) {
          console.log("Crew endpoint not available");
          setCrew([]);
        }

        // Fetch user permissions for this movie
        try {
          const permissionsRes = await axios.get(
            `http://127.0.0.1:8080/accessible/Movie/${user.id}/movie/${id}/permissions`
          );
          
          if (permissionsRes.data.has_access) {
            setUserPermissions(permissionsRes.data.permissions);
            setUserAccessType(permissionsRes.data.access_type);
            setUserContribution(permissionsRes.data.contribution);
          } else {
            // User has no permissions - can only view
            setUserPermissions({
              video: false,
              image: false,
              live: false,
              scripts: false,
              crew: false
            });
            setUserAccessType("viewer");
          }
        } catch (err) {
          console.log("Error fetching permissions, defaulting to viewer");
          setUserAccessType("viewer");
        }
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user]);

  /* ================= PERMISSION CHECK FUNCTIONS ================= */
  const hasPermission = (permissionType) => {
    return userPermissions[permissionType] || false;
  };

  const hasVideoPermission = () => hasPermission('video');
  const hasImagePermission = () => hasPermission('image');
  const hasLivePermission = () => hasPermission('live');
  const hasCrewPermission = () => hasPermission('crew');
  const hasScriptsPermission = () => hasPermission('scripts');

  const isCreator = userAccessType === "creator";
  const isCrewMember = userAccessType === "crew_member";
  const isViewer = userAccessType === "viewer";

  /* ================= TRAILER HANDLERS ================= */
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

  /* ================= IMAGE HANDLERS ================= */
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.file || !newImage.title || !newImage.people) {
      alert("Please fill in all required fields");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('title', newImage.title);
      formData.append('description', newImage.description);
      formData.append('people', newImage.people);
      formData.append('image', newImage.file);
      formData.append('movie_id', movie.movie_id);

      const response = await axios.post(
        `http://127.0.0.1:8080/movie-images/create/movie_image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      const newImg = response.data.image;
      const mappedImage = {
        id: newImg.image_id,
        url: newImg.image_url,
        title: newImg.title,
        people: newImg.people,
        description: newImg.description
      };

      setImages([...images, mappedImage]);
      setNewImage({ title: '', description: '', file: null, preview: '', people: '' });
      setShowImageModal(false);
      alert("Image added successfully");
    } catch (err) {
      console.error("Error adding image", err);
      alert("Failed to add image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8080/movie-images/image/delete/${imageId}`,
        { withCredentials: true }
      );

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setShowImageDetail(false);
      setSelectedImage(null);
      alert("Image deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete image");
    }
  };

  const handleEditImage = () => {
    setEditedImage({
      title: selectedImage.title,
      people: selectedImage.people,
      description: selectedImage.description || ''
    });
    setIsEditingImage(true);
  };

  const handleSaveImage = async () => {
    if (!editedImage.title || !editedImage.people) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSavingImage(true);
    try {
      const formData = new FormData();
      if (editedImage.title !== selectedImage.title) {
        formData.append('title', editedImage.title);
      }
      if (editedImage.people !== selectedImage.people) {
        formData.append('people', Array.isArray(editedImage.people) ? editedImage.people.join(', ') : editedImage.people);
      }
      if (editedImage.description !== (selectedImage.description || '')) {
        formData.append('description', editedImage.description);
      }

      const response = await axios.put(
        `http://127.0.0.1:8080/movie-images/update/${selectedImage.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      const updatedImg = response.data.image;
      const mappedImage = {
        id: updatedImg.image_id,
        url: updatedImg.image_url,
        title: updatedImg.title,
        people: updatedImg.people,
        description: updatedImg.description
      };

      setImages(images.map(img => img.id === selectedImage.id ? mappedImage : img));
      setSelectedImage(mappedImage);
      setIsEditingImage(false);
      setEditedImage(null);
      alert("Image updated successfully");
    } catch (err) {
      console.error("Error updating image", err);
      alert("Failed to update image");
    } finally {
      setIsSavingImage(false);
    }
  };

  /* ================= LIVE HANDLERS ================= */
  const handleAddLiveMovie = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:8080/live/add`,
        {
          movie_id: movie.movie_id,
          title: newLiveMovie.title,
          date: newLiveMovie.date,
          time: newLiveMovie.time,
          description: newLiveMovie.description,
        },
        { withCredentials: true }
      );

      setLiveStreams([...liveStreams, response.data]);
      setNewLiveMovie({ title: '', date: '', time: '', description: '' });
      setShowLiveModal(false);
      alert("Live session scheduled successfully");
    } catch (err) {
      console.error("Error scheduling live session", err);
      alert("Failed to schedule live session");
    }
  };

  /* ================= CREW HANDLERS ================= */
  const handleEditCrewMember = (crewMember) => {
    setEditingCrewMember(crewMember);
    setNewCrewMember({
      linkedin_id: crewMember.linkedin_id || '',
      movie_data: {
        movie_id: id,
        contribution: crewMember.contribution || '',
        permissions: crewMember.permissions || {
          video: false,
          image: false,
          live: false,
          scripts: false,
          crew: false
        }
      }
    });
    setShowCrewModal(true);
  };

  const handleUpdateCrewMember = async (e) => {
    e.preventDefault();
    
    if (!editingCrewMember) return;
    
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8001/crew/${editingCrewMember.id}/movie/${id}`,
        {
          linkedin_id: newCrewMember.linkedin_id,
          movie_data: newCrewMember.movie_data
        },
        { withCredentials: true }
      );

      // Update local state
      setCrew(crew.map(member => 
        member.id === editingCrewMember.id ? response.data : member
      ));
      
      closeCrewModal();
      alert("Crew member updated successfully");
    } catch (err) {
      console.error("Error updating crew member", err);
      alert(err.response?.data?.detail || "Failed to update crew member");
    }
  };

  const handleAddCrewMember = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:8001/crew/add`,
        {
          linkedin_id: newCrewMember.linkedin_id,
          movie_data: {
            movie_id: id,
            contribution: newCrewMember.movie_data.contribution,
            permissions: newCrewMember.movie_data.permissions
          }
        },
        { withCredentials: true }
      );

      setCrew([...crew, response.data]);
      closeCrewModal();
      alert("Crew member added successfully");
    } catch (err) {
      console.error("Error adding crew member", err);
      alert(err.response?.data?.detail || "Failed to add crew member");
    }
  };

  const handleCrewSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCrewMember) {
      await handleUpdateCrewMember(e);
    } else {
      await handleAddCrewMember(e);
    }
  };

  const handleDeleteCrewMember = async (crewId) => {
    if (!window.confirm("Are you sure you want to delete this crew member?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8001/crew/${crewId}/movie/${id}`,
        { withCredentials: true }
      );

      setCrew(crew.filter(member => member.id !== crewId));
      alert("Crew member deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.detail || "Failed to delete crew member");
    }
  };

  const closeCrewModal = () => {
    setNewCrewMember({
      linkedin_id: '',
      movie_data: {
        movie_id: id,
        contribution: '',
        permissions: {
          video: false,
          image: false,
          live: false,
          scripts: false,
          crew: false
        }
      }
    });
    setEditingCrewMember(null);
    setShowCrewModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!movie) return null;

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
            className="flex items-center space-x-2 text-gray-400 hover:text-amber-600 mb-6"
          >
            ← Back
          </button>

          {/* ================= MOVIE HEADER ================= */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl mb-8">
            <div className="relative h-80 sm:h-96">
              {/* Banner */}
              {movie.bannerImage ? (
                <img
                  src={movie.bannerImage}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-amber-600">
                  No Banner
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Poster */}
              <div className="absolute bottom-6 left-6 w-32 h-48 rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-gray-900">
                {movie.mainImage ? (
                  <img
                    src={movie.mainImage}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-amber-600">
                    No Image
                  </div>
                )}
              </div>

              {/* Title and Access Info */}
              <div className="absolute bottom-6 left-44 right-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-300">
                    {movie.type} • {movie.duration}
                  </p>
                  {userAccessType !== "none" && (
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        userAccessType === "creator" 
                          ? "bg-green-900/50 text-green-300 border border-green-700/50"
                          : userAccessType === "crew_member"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}>
                        {userAccessType === "creator" 
                          ? "Creator" 
                          : userAccessType === "crew_member"
                          ? `${userContribution}`
                          : "Viewer"}
                      </span>
                      {(hasVideoPermission() || hasImagePermission() || hasLivePermission() || hasCrewPermission()) && (
                        <div className="flex space-x-1">
                          {hasVideoPermission() && (
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">Video</span>
                          )}
                          {hasImagePermission() && (
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">Image</span>
                          )}
                          {hasLivePermission() && (
                            <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded">Live</span>
                          )}
                          {hasCrewPermission() && (
                            <span className="px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded">Crew</span>
                          )}
                          {hasScriptsPermission() && (
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">Scripts</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= TABS NAVIGATION ================= */}
          <HorizontalTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            tabs={[
              { id: "home", label: "Home" },
              { id: "videos", label: "Videos" },
              { id: "images", label: "Images" },
              { id: "live", label: "Live" },
              { id: "crew", label: "Crew" }
            ]}
          />

          {/* ================= TAB CONTENT ================= */}
          {activeTab === "home" && (
            <div>
              {/* ================= DETAILS ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10">
                <Detail label="IMDb ID" value={movie.imdbID} />
                <Detail
                  label="Release Date"
                  value={new Date(movie.release_date).toDateString()}
                />
                <Detail label="Directors" value={movie.directors.join(", ")} />
                <Detail label="Writers" value={movie.writers.join(", ")} />
                <Detail label="Genres" value={movie.genres.join(", ")} />

                <div className="md:col-span-2">
                  <h3 className="text-amber-500 font-semibold mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300">{movie.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <VideoTab 
              trailers={trailers}
              movieId={movie.movie_id}
              onDelete={hasVideoPermission() ? handleDeleteTrailer : null}
              onNavigateAddTrailer={hasVideoPermission() ? () => navigate(`/movie/${movie.movie_id}/add-trailer`) : null}
              hasVideoPermission={hasVideoPermission()}
            />
          )}

          {activeTab === "images" && (
            <ImageTab 
              images={images}
              movieId={movie.movie_id}
              onDelete={hasImagePermission() ? handleDeleteImage : null}
              onImageClick={(image) => {
                setSelectedImage(image);
                setShowImageDetail(true);
              }}
              onShowModal={hasImagePermission() ? ((type) => {
                if (type === 'image') setShowImageModal(true);
              }) : null}
              hasImagePermission={hasImagePermission()}
            />
          )}

          {activeTab === "live" && (
            <LiveTab 
              liveStreams={liveStreams}
              movieId={movie.movie_id}
              onShowModal={hasLivePermission() ? ((type) => {
                if (type === 'live') setShowLiveModal(true);
              }) : null}
              hasLivePermission={hasLivePermission()}
            />
          )}

          {activeTab === "crew" && (
            <CrewTab 
              crewMembers={crew}
              onDelete={hasCrewPermission() ? handleDeleteCrewMember : null}
              onEdit={hasCrewPermission() ? handleEditCrewMember : null}
              onShowModal={hasCrewPermission() ? () => setShowCrewModal(true) : null}
              hasCrewPermission={hasCrewPermission()}
              // Pass the movie creator's LinkedIn ID if available
              creatorLinkedinId={movie?.user_id} // or however you get creator's ID
              userAccessType={userAccessType}
            />
          )}
        </div>
      </main>

      {/* ================= ADD IMAGE MODAL ================= */}
      {showImageModal && hasImagePermission() && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
		<div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Image</h3>
              <button
                onClick={() => {
                  setNewImage({ title: '', description: '', file: null, preview: '', people: '' });
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
              
              {/* People Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>People</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={newImage.people}
                  onChange={(e) => setNewImage({ ...newImage, people: e.target.value })}
                  placeholder="Enter people"
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
                  disabled={!newImage.preview || !newImage.title || isUploadingImage}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  {isUploadingImage ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Add Image</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewImage({ title: '', description: '', file: null, preview: '', people: '' });
                    setShowImageModal(false);
                  }}
                  disabled={isUploadingImage}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD LIVE MODAL ================= */}
      {showLiveModal && hasLivePermission() && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Schedule Live Session</h3>
              <button
                onClick={() => setShowLiveModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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

      {/* ================= CREW MODAL ================= */}
      {showCrewModal && hasCrewPermission() && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingCrewMember ? 'Edit Crew Member' : 'Add Crew Member'}
              </h3>
              <button
                onClick={closeCrewModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCrewSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* LinkedIn ID */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">LinkedIn ID</label>
                  <input
                    type="text"
                    value={newCrewMember.linkedin_id}
                    onChange={(e) => setNewCrewMember({ 
                      ...newCrewMember, 
                      linkedin_id: e.target.value 
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="e.g., john-doe-123456"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">The LinkedIn profile ID</p>
                </div>

                {/* Contribution (Dropdown) */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Contribution</label>
                  <select
                    value={newCrewMember.movie_data.contribution}
                    onChange={(e) => setNewCrewMember({ 
                      ...newCrewMember,
                      movie_data: {
                        ...newCrewMember.movie_data,
                        contribution: e.target.value
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select contribution</option>
                    <option value="Director">Director</option>
                    <option value="Producer">Producer</option>
                    <option value="Screenwriter">Screenwriter</option>
                    <option value="Cinematographer">Cinematographer</option>
                    <option value="Editor">Editor</option>
                    <option value="Sound Designer">Sound Designer</option>
                    <option value="Production Designer">Production Designer</option>
                    <option value="Costume Designer">Costume Designer</option>
                    <option value="Makeup Artist">Makeup Artist</option>
                    <option value="Actor">Actor</option>
                    <option value="Stunt Coordinator">Stunt Coordinator</option>
                    <option value="Visual Effects">Visual Effects</option>
                    <option value="Music Composer">Music Composer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Permissions Section */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-4 font-medium">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {/* Video Permission */}
                  <label className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCrewMember.movie_data.permissions?.video || false}
                      onChange={(e) => setNewCrewMember({
                        ...newCrewMember,
                        movie_data: {
                          ...newCrewMember.movie_data,
                          permissions: {
                            ...newCrewMember.movie_data.permissions,
                            video: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Video</span>
                      <span className="text-gray-400 text-xs">Access to video files</span>
                    </div>
                  </label>

                  {/* Image Permission */}
                  <label className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCrewMember.movie_data.permissions?.image || false}
                      onChange={(e) => setNewCrewMember({
                        ...newCrewMember,
                        movie_data: {
                          ...newCrewMember.movie_data,
                          permissions: {
                            ...newCrewMember.movie_data.permissions,
                            image: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Image</span>
                      <span className="text-gray-400 text-xs">Access to images</span>
                    </div>
                  </label>

                  {/* Live Permission */}
                  <label className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCrewMember.movie_data.permissions?.live || false}
                      onChange={(e) => setNewCrewMember({
                        ...newCrewMember,
                        movie_data: {
                          ...newCrewMember.movie_data,
                          permissions: {
                            ...newCrewMember.movie_data.permissions,
                            live: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Live</span>
                      <span className="text-gray-400 text-xs">Live streaming access</span>
                    </div>
                  </label>

                  {/* Scripts Permission */}
                  <label className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCrewMember.movie_data.permissions?.scripts || false}
                      onChange={(e) => setNewCrewMember({
                        ...newCrewMember,
                        movie_data: {
                          ...newCrewMember.movie_data,
                          permissions: {
                            ...newCrewMember.movie_data.permissions,
                            scripts: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Scripts</span>
                      <span className="text-gray-400 text-xs">Access to scripts</span>
                    </div>
                  </label>

                  {/* Crew Permission */}
                  <label className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCrewMember.movie_data.permissions?.crew || false}
                      onChange={(e) => setNewCrewMember({
                        ...newCrewMember,
                        movie_data: {
                          ...newCrewMember.movie_data,
                          permissions: {
                            ...newCrewMember.movie_data.permissions,
                            crew: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Crew</span>
                      <span className="text-gray-400 text-xs">Manage crew members</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all"
                >
                  {editingCrewMember ? 'Update Crew Member' : 'Add Crew Member'}
                </button>
                <button
                  type="button"
                  onClick={closeCrewModal}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= IMAGE DETAIL MODAL ================= */}
      {showImageDetail && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full border border-gray-700 shadow-2xl my-8">
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b border-gray-700">
              <button
                onClick={() => {
                  setShowImageDetail(false);
                  setSelectedImage(null);
                  setIsEditingImage(false);
                  setEditedImage(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Full Image */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-1 flex flex-col space-y-6">
                {!isEditingImage ? (
                  <>
                    {/* Display Mode */}
                    {/* Title */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
                      <div className="h-1 w-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded"></div>
                    </div>

                    {/* People */}
                    {selectedImage.people && selectedImage.people.length > 0 && (
                      <div>
                        <h3 className="text-amber-500 font-semibold mb-3">People</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.people.map((person, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-amber-500 transition-colors"
                            >
                              {person}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {selectedImage.description && (
                      <div>
                        <h3 className="text-amber-500 font-semibold mb-3">Description</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedImage.description}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons - Only show if user has image permission */}
                    {hasImagePermission() && (
                      <div className="flex space-x-3 pt-4 border-t border-gray-700">
                        <button
                          onClick={handleEditImage}
                          className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(selectedImage.id)}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Edit Mode - Only show if user has image permission */}
                    {hasImagePermission() && (
                      <>
                        {/* Title Input */}
                        <div>
                          <label className="text-amber-500 font-semibold mb-2 block">Title</label>
                          <input
                            type="text"
                            value={editedImage.title}
                            onChange={(e) => setEditedImage({ ...editedImage, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                            required
                          />
                        </div>

                        {/* People Input */}
                        <div>
                          <label className="text-amber-500 font-semibold mb-2 block">People</label>
                          <input
                            type="text"
                            value={Array.isArray(editedImage.people) ? editedImage.people.join(', ') : editedImage.people}
                            onChange={(e) => setEditedImage({ ...editedImage, people: e.target.value })}
                            placeholder="Comma-separated names"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                            required
                          />
                        </div>

                        {/* Description Input */}
                        <div>
                          <label className="text-amber-500 font-semibold mb-2 block">Description</label>
                          <textarea
                            value={editedImage.description}
                            onChange={(e) => setEditedImage({ ...editedImage, description: e.target.value })}
                            placeholder="Image description"
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-700">
                          <button
                            onClick={handleSaveImage}
                            disabled={isSavingImage}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                          >
                            {isSavingImage ? (
                              <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Save</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingImage(false);
                              setEditedImage(null);
                            }}
                            disabled={isSavingImage}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPER COMPONENT ================= */
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}

export default MovieDetail;