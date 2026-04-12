import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { AuthProvider } from './context/AuthContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { ArtistHome } from './pages/ArtistHome';
import { ArtistLogin } from './pages/ArtistLogin';
import { ArtistProfile } from './pages/ArtistProfile';
import { ArtistRegister } from './pages/ArtistRegister';
import { ArtistRegistration } from './pages/ArtistRegistration';
import { BookWorkshop } from './pages/BookWorkshop';
import { BrowseArtists } from './pages/BrowseArtists';
import { CraftShop } from './pages/CraftShop';
import EditBooking from './pages/EditBooking';
import { FullMap } from './pages/FullMap';
import { Home } from './pages/Home';
import { Inbox } from './pages/Inbox';
import MyBookings from './pages/MyBookings';
import { RegisterSelect } from './pages/RegisterSelect';
import { UnifiedLogin } from './pages/UnifiedLogin';
import { TouristBlogEdit } from './pages/tourist/TouristBlogEdit';
import { TouristBlogs } from './pages/tourist/TouristBlogs';
import { TouristDashboard } from './pages/tourist/TouristDashboard';
import { TouristHome } from './pages/tourist/TouristHome';
import { TouristLogin } from './pages/tourist/TouristLogin';
import { TouristProfile } from './pages/tourist/TouristProfile';
import { TouristProfileEdit } from './pages/tourist/TouristProfileEdit';
import { TouristRegister } from './pages/tourist/TouristRegister';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crafts" element={<CraftShop />} />
          <Route path="/artists" element={<BrowseArtists />} />
          <Route path="/browse" element={<BrowseArtists />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/book" element={<BookWorkshop />} />
          <Route path="/map" element={<FullMap />} />

          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/register" element={<RegisterSelect />} />
          <Route path="/artist/register" element={<ArtistRegister />} />
          <Route path="/artist/register/legacy" element={<ArtistRegistration />} />
          <Route path="/artist/login" element={<ArtistLogin />} />
          <Route path="/tourist/login" element={<TouristLogin />} />
          <Route path="/tourist/register" element={<TouristRegister />} />

          <Route path="/tourist/home" element={<TouristHome />} />
          <Route path="/tourist/dashboard" element={<TouristDashboard />} />
          <Route path="/tourist/blogs" element={<TouristBlogs />} />
          <Route path="/tourist/blogs/edit/:id" element={<TouristBlogEdit />} />
          <Route path="/tourist/profile" element={<TouristProfile />} />
          <Route path="/tourist/profile/edit" element={<TouristProfileEdit />} />
          <Route path="/tourist/bookings" element={<BookWorkshop />} />
          <Route path="/tourist/inbox" element={<Inbox />} />

          <Route path="/artist/home" element={<ArtistHome />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/artist/inbox" element={<Inbox />} />

          <Route path="/dashboard" element={<Navigate to="/artist/dashboard" replace />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/edit-booking/:id" element={<EditBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}
