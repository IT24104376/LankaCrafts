import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  BellIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  LogOutIcon,
  HomeIcon,
  MessageCircleIcon
} from
  'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../../lib/auth';
interface TouristNavbarProps {
  userName?: string;
  userInitials?: string;
  activeTab?: string;
}
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'TU';
export function TouristNavbar({
  userName,
  userInitials,
  activeTab,
}: TouristNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const storedUser = getStoredUser();
  const resolvedUserName = userName || storedUser?.fullName || 'Tourist User';
  const resolvedUserInitials = userInitials || getInitials(resolvedUserName);
  const navLinks = [
    {
      label: 'Home',
      href: '/tourist/home',
      icon: HomeIcon
    },
    {
      label: 'Dashboard',
      href: '/tourist/dashboard',
      icon: LayoutDashboardIcon
    },
    {
      label: 'Blogs',
      href: '/tourist/blogs',
      icon: BookOpenIcon
    },
    {
      label: 'Bookings',
      href: '/tourist/bookings',
      icon: CalendarIcon
    },
    {
      label: 'Inbox',
      href: '/tourist/inbox',
      icon: MessageCircleIcon
    }];

  const isActive = (href: string) => {
    return location.pathname === href;
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
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
              fill="#C1440E"
              opacity="0.9" />

            <ellipse
              cx="24"
              cy="16"
              rx="7"
              ry="4"
              fill="#C1440E"
              opacity="0.75" />

            <ellipse
              cx="16"
              cy="24"
              rx="4"
              ry="7"
              fill="#C1440E"
              opacity="0.6" />

            <ellipse
              cx="8"
              cy="16"
              rx="7"
              ry="4"
              fill="#C1440E"
              opacity="0.75" />

            <circle cx="16" cy="16" r="3.5" fill="#C1440E" />
          </svg>
          <span
            className="text-xl font-display font-bold tracking-tight"
            style={{
              color: '#C1440E'
            }}>

            LankaCrafts
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href, icon: Icon }) =>
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 font-body ${isActive(href) ? 'text-[#C1440E] bg-[#FDF0EB]' : 'text-[#1E1E1E] hover:text-[#C1440E] hover:bg-[#FDF0EB]'}`}>

              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )}
        </div>

        {/* Right: Bell + User */}
        <div className="flex items-center gap-3">
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: '#FDF0EB'
            }}
            aria-label="Notifications">

            <BellIcon
              className="w-5 h-5"
              style={{
                color: '#C1440E'
              }} />

            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C1440E] rounded-full border-2 border-white" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors border border-gray-100">

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-body"
                style={{
                  backgroundColor: '#C1440E'
                }}>

                {resolvedUserInitials}
              </div>
              <span className="text-sm font-medium text-[#1E1E1E] font-body hidden sm:block">
                {resolvedUserName}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />

            </button>

            <AnimatePresence>
              {dropdownOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.96
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.96
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs text-gray-400 font-body">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-[#1E1E1E] font-body truncate">
                        {resolvedUserName}
                      </p>
                    </div>
                    <div className="border-t border-gray-100 my-1" />
                    {[
                      {
                        icon: UserIcon,
                        label: 'My Profile',
                        href: '#'
                      },
                      {
                        icon: HeartIcon,
                        label: 'My Wishlist',
                        href: '#'
                      },
                      {
                        icon: CalendarIcon,
                        label: 'My Bookings',
                        href: '/tourist/bookings'
                      },
                      {
                        icon: MessageCircleIcon,
                        label: 'Inbox',
                        href: '/tourist/inbox'
                      }].
                      map(({ icon: Icon, label, href }) =>
                        <Link
                          key={label}
                          to={href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">

                          <Icon className="w-4 h-4 text-[#1A6B6B]" />
                          {label}
                        </Link>
                      )}
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      to="/login"
                      onClick={() => {
                        clearAuthSession();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-body">

                      <LogOutIcon className="w-4 h-4" />
                      Logout
                    </Link>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>);

}
