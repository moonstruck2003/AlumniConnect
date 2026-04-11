import { ReactNode, useState } from "react";
import { CreateSessionDialog } from "./CreateSessionDialog";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('alumni')) return 'Alumni Directory';
    if (path.includes('mentorship')) return 'Mentorship';
    if (path.includes('jobs')) return 'Jobs & Internships';
    if (path.includes('events')) return 'Events';
    if (path.includes('messages')) return 'Messages';
    if (path.includes('profile')) return 'Profile';
    if (path.includes('about')) return 'About Us';
    return 'Dashboard';
  };

  return (
    <div className="layout">
      <div className="global-container" style={{ paddingTop: '3rem' }}>
        <Navbar activeItem={getActiveItem() as any} />
      </div>

      <main id="content">{children}</main>

      <CreateSessionDialog open={isCreateDialogOpen} setOpen={setIsCreateDialogOpen} />
    </div>
  );
};

export default BaseLayout;
