import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDownIcon, UserIcon, LogOutIcon, BellIcon, HeartIcon, CalendarIcon, MessageCircleIcon } from 'lucide-react';
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

  const { tourist, logout } = useAuth();
  const userName = tourist?.fullName ?? 'User';
  const callingName = tourist?.callingName ?? 'User';
  const userInitials = tourist?.initials ?? 'U';
  const userProfilePic = tourist?.profilePicUrl ?? '';

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const leftLinks = artistMode ?
    [
      {
        name: 'Home',
        path: '/artist/home'
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
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#2F5D50',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.25)' : 'none'
      }}>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">

            <ellipse
              cx="16"
              cy="8"
              rx="4"
              ry="7"
              fill="#C9A227"
              opacity="0.9" />

            <ellipse
              cx="24"
              cy="16"
              rx="7"
              ry="4"
              fill="#C9A227"
              opacity="0.75" />

            <ellipse
              cx="16"
              cy="24"
              rx="4"
              ry="7"
              fill="#C9A227"
              opacity="0.6" />

            <ellipse
              cx="8"
              cy="16"
              rx="7"
              ry="4"
              fill="#C9A227"
              opacity="0.75" />

            <circle cx="16" cy="16" r="3.5" fill="#C9A227" />
          </svg>
          <span
            className="text-xl font-display font-bold tracking-tight"
            style={{
              color: '#C9A227'
            }}>

            Lanka Crafts
          </span>
        </Link>

        {/* Desktop: Left Nav Links */}
        <div className="hidden md:flex items-center gap-1 mx-8 flex-1">
          {leftLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 relative group ${isActive(link.path) ? 'text-white bg-white/15' : 'text-white/85 hover:text-white hover:bg-white/10'}`}>

              {link.name}
              <span
                className={`absolute -bottom-0.5 left-4 right-4 h-0.5 rounded-full transition-all duration-300 ${isActive(link.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                style={{
                  backgroundColor: '#C9A227'
                }} />

            </Link>
          )}
        </div>

        {/* Desktop: Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {tourist && !artistMode ? (
            <>
              {/* Notification Bell */}
              <button
                className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                aria-label="Notifications">
                <BellIcon className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2F5D50]" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition-colors border border-white/20">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-body overflow-hidden"
                    style={{ backgroundColor: '#C9A227' }}>
                    {userProfilePic ? (
                      <img src={userProfilePic} alt={callingName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white font-body hidden sm:block">
                    {callingName}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs text-gray-400 font-body">Signed in as</p>
                          <p className="text-sm font-semibold text-[#1E1E1E] font-body truncate">{userName}</p>
                        </div>
                        <div className="border-t border-gray-100 my-1" />
                        {[
                          { icon: UserIcon, label: 'My Profile', href: '/tourist/profile' },
                          { icon: HeartIcon, label: 'My Wishlist', href: '/tourist/profile#myWishlist' },
                          { icon: CalendarIcon, label: 'My Bookings', href: '/tourist/profile#myBookings' },
                          { icon: MessageCircleIcon, label: 'Inbox', href: '/inbox' }
                        ].map(({ icon: Icon, label, href }) => (
                          <Link
                            key={label}
                            to={href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">
                            <Icon className="w-4 h-4 text-[#1A6B6B]" />
                            {label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => { handleLogout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-body">
                          <LogOutIcon className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 text-white/90 hover:text-white hover:bg-white/10 border border-white/20">

                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 border-2 text-white border-white/40 hover:bg-white hover:text-forest"
                style={{
                  borderColor: '#C9A227',
                  color: '#C9A227'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C9A227';
                  e.currentTarget.style.color = '#2F5D50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#C9A227';
                }}>

                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">

          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: -10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            className="md:hidden px-6 pb-6 flex flex-col gap-2"
            style={{
              backgroundColor: '#2F5D50'
            }}>

            <div className="border-t border-white/10 pt-4 space-y-1">
              {leftLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-4 py-2.5 rounded-lg text-white/85 hover:text-white hover:bg-white/10 font-medium text-sm transition-colors"
                  onClick={() => setMenuOpen(false)}>

                  {link.name}
                </Link>
              )}
            </div>
            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              {tourist && !artistMode ? (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-center text-red-200 border border-red-500/30 hover:bg-red-500/10 transition-colors flex justify-center items-center gap-2">
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-center text-white border border-white/20 hover:bg-white/10 transition-colors"
                    onClick={() => setMenuOpen(false)}>

                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-center border-2 transition-colors"
                    style={{
                      borderColor: '#C9A227',
                      color: '#C9A227'
                    }}
                    onClick={() => setMenuOpen(false)}>

                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}