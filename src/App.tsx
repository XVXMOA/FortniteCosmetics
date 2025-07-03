import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProfilePage from "@/pages/Profile";

function App() {
  const { user, loading } = useAuth();

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
      <Route path="/" element={user ? <Index /> : <Auth />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
