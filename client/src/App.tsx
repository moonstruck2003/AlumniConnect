import { Outlet, Route, Routes } from 'react-router';
import BaseLayout from './views/BaseLayout';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Signup from './views/Signup';
import AlumniDirectory from './views/AlumniDirectory';
import About from './About.tsx';
import Messages from './views/Messages';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import Sessions from './views/Sessions';
import Events from './views/Events';
import Mentorship from './views/Mentorship';
import Jobs from './views/Jobs';
import ProfileRouter from './views/ProfileRouter';
import ProtectedRoute from './components/ProtectedRoute';
import AiChatbot from './components/AiChatbot';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        <Route
          element={
            <ProtectedRoute>
              <BaseLayout>
                <Outlet />
              </BaseLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/events" element={<Events />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/about" element={<About />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<ProfileRouter />} />
          <Route path="/profile/:id" element={<ProfileRouter />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            duration: 5000,
          },
        }}
      />
      {isAuthenticated && <AiChatbot />}
    </>
  );
}

export default App;