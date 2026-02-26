import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateChannelPage from "./pages/CreateChannelPage";
import EditChannelPage from "./pages/EditChannelPage";
import HomePage from "./pages/HomePage";
import VideoPage from "./pages/VideoPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import ChannelPage from "./pages/ChannelPage";
import SearchPage from "./pages/SearchPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <p className="text-white text-lg">Cargando...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <PrivateRoute><HomePage /></PrivateRoute>
        } />
        <Route path="/my-channels" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/channels/create" element={
          <PrivateRoute><CreateChannelPage /></PrivateRoute>
        } />
        <Route path="/channels/:id/edit" element={
          <PrivateRoute><EditChannelPage /></PrivateRoute>
        } />
        <Route path="/channels/:id/upload" element={
          <PrivateRoute><UploadVideoPage /></PrivateRoute>
        } />
        <Route path="/videos/:id" element={
          <PrivateRoute><VideoPage /></PrivateRoute>
        } />
        <Route path="/subscriptions" element={
          <PrivateRoute><SubscriptionsPage /></PrivateRoute>
        } />
        <Route path="/channels/:id" element={
          <PrivateRoute><ChannelPage /></PrivateRoute>
        } />
      <Route path="/search" element={
        <PrivateRoute><SearchPage /></PrivateRoute>
      } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;