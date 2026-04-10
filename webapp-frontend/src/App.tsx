import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { CraftShop } from './pages/CraftShop';
import { BrowseArtists } from './pages/BrowseArtists';
import { ArtistProfile } from './pages/ArtistProfile';
import { ArtistRegistration } from './pages/ArtistRegistration';
import { FullMap } from './pages/FullMap';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { BookWorkshop } from './pages/BookWorkshop';
import { UnifiedLogin } from './pages/UnifiedLogin';
import { RegisterSelect } from './pages/RegisterSelect';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { ArtistHome } from './pages/ArtistHome';
import { ArtistLogin } from './pages/ArtistLogin';
import { ArtistRegister } from './pages/ArtistRegister';
import { AuthProvider } from './context/AuthContext';
import { TouristLogin } from './pages/tourist/TouristLogin';
import { TouristRegister } from './pages/tourist/TouristRegister';
import { TouristDashboard } from './pages/tourist/TouristDashboard';
import { TouristBlogs } from './pages/tourist/TouristBlogs';
import { TouristHome } from './pages/tourist/TouristHome';
import { TouristProfile } from './pages/tourist/TouristProfile';
import { TouristProfileEdit } from './pages/tourist/TouristProfileEdit';
import { TouristBlogEdit } from './pages/tourist/TouristBlogEdit';
import { Inbox } from './pages/Inbox';
import EditBooking from "./pages/EditBooking";
import MyBookings from "./pages/MyBookings";

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
          <Route path="/inbox" element={<Inbox />} />

          <Route path="/artist/home" element={<ArtistHome />} />
          <Route path="/dashboard" element={<ArtistDashboard />} />
          <Route path="/edit-booking/:id" element={<EditBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}
