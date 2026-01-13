import { Routes, Route, Navigate } from 'react-router-dom';
import ProducerLogin from './pages/ProducerLogin';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AddMovie from './pages/AddMovie';
import MovieDetail from './pages/MovieDetail';
import AddTrailer from './pages/AddTrailer';
import TrailerDetail from './pages/TrailerDetail';
import ProtectedRoute from './auth/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DeleteAccountPage from './components/DeleteAccount';


function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<ProducerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-movie" 
        element={
          <ProtectedRoute>
            <AddMovie />
          </ProtectedRoute>
        } 
      />
      

      <Route 
        path="/edit-movie/:id"
        element={
          <ProtectedRoute>
            <AddMovie />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/movie/:id" 
        element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movie/:id/add-trailer" 
        element={
          <ProtectedRoute>
            <AddTrailer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movie/:id/trailer/:trailerId" 
        element={
          <ProtectedRoute>
            <TrailerDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/settings/change-password" replace />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>
      
      {/* 404 catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
