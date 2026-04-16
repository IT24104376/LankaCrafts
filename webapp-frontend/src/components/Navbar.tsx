import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDownIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#C9A227" opacity="0.2" />
            <path
              d="M16 4 C10 4 6 10 6 16 C6 22 10 28 16 28 C22 28 26 22 26 16 C26 10 22 4 16 4Z"
              fill="#C9A227"
              opacity="0.6" />

            <path
              d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
              fill="#C9A227" />

          </svg>
          <span
            className="text-white text-xl font-bold tracking-wide"
            style={{
              fontFamily: 'Fraunces, serif'
            }}>

            LankaCrafts
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
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}