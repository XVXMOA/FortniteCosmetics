import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProfilePage from "@/pages/Profile";

function App() {
  const { user, loading } = useAuth();

  // AUTHENTICATION IS CURRENTLY DORMANT
  // To reactivate: change the condition below from true to (user ? true : false)
  const AUTH_ENABLED = false; // Set to true to reactivate authentication

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      {/* Authentication dormant: always show Index page */}
      <Route path="/" element={AUTH_ENABLED ? (user ? <Index /> : <Auth />) : <Index />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
