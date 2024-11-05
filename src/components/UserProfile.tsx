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

  // Using a div with role="navigation" for better accessibility
  return (
    <div role="navigation" className="fixed top-4 right-4 flex items-center gap-3">
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">demo</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </>
      ) : (
        <div className="text-sm text-gray-500">Not logged in</div>
      )}
    </div>
  );
};

export default UserProfile;