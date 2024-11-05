import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";

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
                      {/* Other routes will be added here */}
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
