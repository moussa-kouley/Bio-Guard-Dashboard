import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "../App";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "demo" && password === "demo") {
      setIsLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Welcome to BioGuard",
      });
      navigate("/map");
    } else {
      toast({
        title: "Login failed",
        description: "Please use demo/demo to login",
        variant: "destructive",
      });
    }
  };

  const handleContinueWithoutLogin = () => {
    setIsLoggedIn(false);
    toast({
      title: "Limited Access Mode",
      description: "You can only access Map and Education pages",
    });
    navigate("/map");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with logo and description */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="max-w-xl w-full space-y-8">
          <img src="/logo.svg" alt="BioGuard" className="w-64 h-64 mx-auto" />
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">GLOBAL ACTING IN IT 2024</h2>
            <div className="border rounded-lg p-6">
              <p className="text-2xl font-medium">
                Monitoring, prevention and predicting application for Water Hyacinth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome to BioGuard app.</h1>
            <h2 className="text-3xl">Log In</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  placeholder="Username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-green-500 hover:bg-green-600"
              >
                Log In
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white border-0"
                onClick={handleContinueWithoutLogin}
              >
                Continue without logging in
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-primary">Use demo/demo to login</p>
        </div>
      </div>
    </div>
  );
};

export default Index;