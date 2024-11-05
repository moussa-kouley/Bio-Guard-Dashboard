import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/App";
import { LogOut, User } from "lucide-react";
import { useToast } from "./ui/use-toast";

const UserProfile = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of BioGuard",
    });
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div role="navigation" className="fixed top-2 right-6 p-4 z-50 flex items-center gap-3">
      {isLoggedIn ? (
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium hidden sm:inline">demo</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoginRedirect}
          className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm hover:bg-white/90"
        >
          Not logged in
        </Button>
      )}
    </div>
  );
};

export default UserProfile;