import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import DroneControl from "./pages/DroneControl";
import Education from "./pages/Education";
import Team from "./pages/Team";
import { createContext, useContext, useState } from "react";

const queryClient = new QueryClient();

// Create auth context
export const AuthContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/*"
                element={
                  <>
                    <Sidebar />
                    <div className="ml-16 flex-1">
                      <Routes>
                        <Route path="/map" element={<Map />} />
                        <Route path="/education" element={<Education />} />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/drone-control"
                          element={
                            <ProtectedRoute>
                              <DroneControl />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/team"
                          element={
                            <ProtectedRoute>
                              <Team />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;