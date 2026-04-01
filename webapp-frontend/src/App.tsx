import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { CraftShop } from './pages/CraftShop';
import { BrowseArtists } from './pages/BrowseArtists';
import { ArtistProfile } from './pages/ArtistProfile';
import { ArtistRegistration } from './pages/ArtistRegistration';
import { FullMapPage } from './pages/FullMap';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { BookWorkshop } from './pages/BookWorkshop';
import { UnifiedLogin } from './pages/UnifiedLogin';
import { RegisterSelect } from './pages/RegisterSelect';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { ArtistHome } from './pages/ArtistHome';
import { AdminDashboard } from './pages/AdminDashboard';
import { TouristLogin } from './pages/tourist/TouristLogin';
import { TouristRegister } from './pages/tourist/TouristRegister';
import { TouristDashboard } from './pages/tourist/TouristDashboard';
import { TouristHome } from './pages/tourist/TouristHome';
import { TouristBlogs } from './pages/tourist/TouristBlogs';
import { Inbox } from './pages/Inbox';
import { AdminRegister } from './pages/AdminRegister';
import { ROLE_DEFAULT_ROUTES, getStoredUser } from './lib/auth';
// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function InboxRedirect() {
  const storedUser = getStoredUser();

  if (storedUser?.role === 'artist') {
    return <Navigate to="/artist/inbox" replace />;
  }

  if (storedUser?.role === 'tourist') {
    return <Navigate to="/tourist/inbox" replace />;
  }

  return <Navigate to="/login" replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/crafts" element={<CraftShop />} />
        <Route path="/artists" element={<BrowseArtists />} />
        <Route path="/browse" element={<BrowseArtists />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/book" element={<BookWorkshop />} />
        <Route path="/map" element={<FullMapPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<UnifiedLogin />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/artist/register" element={<ArtistRegistration />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/tourist/login" element={<TouristLogin />} />
        <Route path="/tourist/register" element={<TouristRegister />} />

        {/* Tourist routes */}
        <Route path="/tourist/home" element={<TouristHome />} />
        <Route path="/tourist/dashboard" element={<TouristDashboard />} />
        <Route path="/tourist/blogs" element={<TouristBlogs />} />
        <Route path="/tourist/bookings" element={<BookWorkshop />} />
        <Route path="/tourist/inbox" element={<Inbox />} />

        {/* Artist routes */}
        <Route path="/artist/home" element={<ArtistHome />} />
        <Route path="/artist/inbox" element={<Inbox />} />
        <Route path={ROLE_DEFAULT_ROUTES.artist} element={<ArtistDashboard />} />
        <Route path="/dashboard" element={<Navigate to={ROLE_DEFAULT_ROUTES.artist} replace />} />
        <Route path="/inbox" element={<InboxRedirect />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>);

}
