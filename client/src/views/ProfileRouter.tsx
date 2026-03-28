import { useAuth } from '../context/AuthContext';
import AlumniProfile from './AlumniProfile';
import RecruiterProfile from './RecruiterProfile';
import './AlumniProfile.css'; // ensure the base styles are loaded for the fallback

import StudentProfile from './StudentProfile';

export default function ProfileRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  const role = (user.role as string) || 'alumni';

  if (role === 'alumni') {
    return <AlumniProfile />;
  } else if (role === 'recruiter') {
    return <RecruiterProfile />;
  } else if (role === 'student') {
    return <StudentProfile />;
  } else {
    // Default fallback
    return <AlumniProfile />;
  }
}
