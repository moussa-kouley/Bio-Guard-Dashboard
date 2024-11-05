import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import DroneControl from "./pages/DroneControl";
import Education from "./pages/Education";
import Team from "./pages/Team";

const queryClient = new QueryClient();

const App = () => {
  return (
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
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/drone-control" element={<DroneControl />} />
                      <Route path="/education" element={<Education />} />
                      <Route path="/team" element={<Team />} />
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
  );
};

export default App;