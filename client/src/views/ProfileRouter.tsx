import { useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import AlumniProfile from './AlumniProfile';
import RecruiterProfile from './RecruiterProfile';
import StudentProfile from './StudentProfile';
import './AlumniProfile.css'; 

export default function ProfileRouter() {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  
  if (!currentUser && !id) {
    return null;
  }

  // If viewing someone else, we might need their specific role component.
  // For now, let's assume we can pass the ID to these components.
  const role = id ? 'alumni' : ((currentUser?.role as string) || 'alumni');

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
