import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDownIcon, BellIcon,
  HomeIcon,
  LayoutDashboardIcon,
  UserIcon,
  CalendarIcon,
  BookOpenIcon,
  MessageCircleIcon,
  SparklesIcon,
  LogOutIcon,
  HeartIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
interface NavbarProps {
  artistMode?: boolean;
}
export function Navbar({ artistMode = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { tourist, artist, logout, logoutArtist } = useAuth();
  const activeUser = artist || tourist;
  const userName = activeUser?.fullName ?? 'User';
  const callingName = activeUser?.callingName ?? 'User';
  const userInitials = activeUser?.initials ?? 'U';
  const userProfilePic = activeUser?.profilePicUrl ?? '';

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const leftLinks = (artist || artistMode) ?
    [
      {
        name: 'Home',
        path: '/'
      },
      {
        name: 'Dashboard',
        path: '/dashboard'
      },
      {
        name: 'Artists',
        path: '/browse'
      },
      {
        name: 'Book a Workshop',
        path: '/book'
      },
      {
        name: 'Blogs',
        path: '/tourist/blogs'
      },
      {
        name: 'Inbox',
        path: '/inbox'
      }] :
    tourist ?
      [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Dashboard',
          path: '/tourist/dashboard'
        },
        {
          name: 'Artists',
          path: '/browse'
        },
        {
          name: 'Book a Workshop',
          path: '/book'
        },
        {
          name: 'Blogs',
          path: '/tourist/blogs'
        },
        {
          name: 'Inbox',
          path: '/inbox'
        }] :
      [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Crafts',
          path: '/crafts'
        },
        {
          name: 'Artists',
          path: '/browse'
        },
        {
          name: 'Book a Workshop',
          path: '/book'
        },
        {
          name: 'Blogs',
          path: '/tourist/blogs'
        }];


  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path) && path !== '/';
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2F5D50] border-b border-white/10 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="16" cy="8" rx="4" ry="7" fill="#C9A227" opacity="0.9" />
            <ellipse cx="24" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
            <ellipse cx="16" cy="24" rx="4" ry="7" fill="#C9A227" opacity="0.6" />
            <ellipse cx="8" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
            <circle cx="16" cy="16" r="3.5" fill="#C9A227" />
          </svg>
          <span className="text-lg font-display font-bold text-[#C9A227]">
            Lanka Crafts
          </span>
        </Link>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-1">
          {leftLinks.map((link) => {
            const Icon =
              link.name === 'Home' ? HomeIcon :
                link.name === 'Dashboard' ? LayoutDashboardIcon :
                  link.name === 'Artists' ? UserIcon :
                    link.name === 'Book a Workshop' ? CalendarIcon :
                      link.name === 'Blogs' ? BookOpenIcon :
                        link.name === 'Inbox' ? MessageCircleIcon :
                          SparklesIcon;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive(link.path)
                    ? 'text-[#C9A227] bg-[#3f6f63] shadow-sm'
                    : 'text-white/85 hover:text-[#C9A227] hover:bg-[#3f6f63]'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive(link.path)
                    ? 'text-[#C9A227]'
                    : 'text-white/70'
                    }`}
                />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          {(artist || (tourist && !artistMode)) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#3f6f63]"
            >
              <BellIcon className="w-5 h-5 text-[#C9A227]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2F5D50]" />
            </motion.button>
          )}

          {/* USER DROPDOWN */}
          {(artist || tourist) ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/20 hover:bg-[#3f6f63] transition"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden bg-[#C9A227]">
                  {userProfilePic ? (
                    <img src={userProfilePic} className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>

                <span className="text-sm text-white hidden sm:block">
                  {callingName}
                </span>

                <ChevronDownIcon
                  className={`w-4 h-4 text-white/70 transition ${dropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-2">

                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs text-gray-400">
                          {artist ? 'Logged in as Artist' : 'Signed in as'}
                        </p>
                        <p className="text-sm font-semibold text-[#1E1E1E] truncate">
                          {userName}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 my-1" />

                      {artist ? (
                        <>
                          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <LayoutDashboardIcon className="w-4 h-4 text-[#C9A227]" />
                            Dashboard
                          </Link>
                          <Link to="/dashboard?tab=crafts" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <HeartIcon className="w-4 h-4 text-[#C9A227]" />
                            Manage Crafts
                          </Link>
                          <div className="border-t my-1" />
                          <button
                            onClick={() => { logoutArtist(); setDropdownOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50"
                          >
                            <LogOutIcon className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/tourist/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <UserIcon className="w-4 h-4 text-[#C9A227]" />
                            My Profile
                          </Link>
                          <Link to="/tourist/profile#myWishlist" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <HeartIcon className="w-4 h-4 text-[#C9A227]" />
                            Wishlist
                          </Link>
                          <Link to="/tourist/profile#myBookings" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <CalendarIcon className="w-4 h-4 text-[#C9A227]" />
                            Bookings
                          </Link>
                          <Link to="/inbox" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-100">
                            <MessageCircleIcon className="w-4 h-4 text-[#C9A227]" />
                            Inbox
                          </Link>
                          <div className="border-t my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50"
                          >
                            <LogOutIcon className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white border border-white/20 hover:bg-[#3f6f63]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#C9A227] text-[#2F5D50]"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Button */}
          <button
            className="md:hidden text-white ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );

}