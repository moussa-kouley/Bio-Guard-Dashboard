import { MapPin, LayoutDashboard, Plane, GraduationCap, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

const Sidebar = () => {
  const location = useLocation();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-white border-r flex flex-col items-center py-4">
      <div className="mb-8 flex flex-col items-center">
        <img src="/logo.svg" alt="BioGuard" className="w-12 h-12" />
        <span className="text-xs font-semibold mt-2 text-primary rotate-[-90deg] whitespace-nowrap">BioGuard</span>
      </div>
      
      <nav className="flex flex-col gap-4">
        <Link to="/map" className={`sidebar-icon ${location.pathname === '/map' ? 'bg-primary/10' : ''}`}>
          <MapPin className="w-6 h-6" />
        </Link>
        {isLoggedIn && (
          <Link to="/dashboard" className={`sidebar-icon ${location.pathname === '/dashboard' ? 'bg-primary/10' : ''}`}>
            <LayoutDashboard className="w-6 h-6" />
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/drone-control" className={`sidebar-icon ${location.pathname === '/drone-control' ? 'bg-primary/10' : ''}`}>
            <Plane className="w-6 h-6" />
          </Link>
        )}
        <Link to="/education" className={`sidebar-icon ${location.pathname === '/education' ? 'bg-primary/10' : ''}`}>
          <GraduationCap className="w-6 h-6" />
        </Link>
        {isLoggedIn && (
          <Link to="/team" className={`sidebar-icon ${location.pathname === '/team' ? 'bg-primary/10' : ''}`}>
            <Users className="w-6 h-6" />
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;