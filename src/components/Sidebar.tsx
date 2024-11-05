import { MapPin, LayoutDashboard, Plane, GraduationCap, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-white border-r flex flex-col items-center py-4">
      <div className="mb-8">
        <img src="/logo.png" alt="BioGuard" className="w-12 h-12" />
      </div>
      
      <nav className="flex flex-col gap-4">
        <Link to="/map" className={`sidebar-icon ${location.pathname === '/map' ? 'bg-primary/10' : ''}`}>
          <MapPin className="w-6 h-6" />
        </Link>
        <Link to="/dashboard" className={`sidebar-icon ${location.pathname === '/dashboard' ? 'bg-primary/10' : ''}`}>
          <LayoutDashboard className="w-6 h-6" />
        </Link>
        <Link to="/drone-control" className={`sidebar-icon ${location.pathname === '/drone-control' ? 'bg-primary/10' : ''}`}>
          <Plane className="w-6 h-6" />
        </Link>
        <Link to="/education" className={`sidebar-icon ${location.pathname === '/education' ? 'bg-primary/10' : ''}`}>
          <GraduationCap className="w-6 h-6" />
        </Link>
        <Link to="/team" className={`sidebar-icon ${location.pathname === '/team' ? 'bg-primary/10' : ''}`}>
          <Users className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;