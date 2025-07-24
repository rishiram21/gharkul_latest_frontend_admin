// Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-violet-900 text-white py-4 shadow-md z-50 w-full">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="text-white md:hidden mr-2"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="/gharkul.png"
            alt="Gharkul Logo"
            className="h-10 w-10 object-cover rounded-md shadow-sm"
          />
          <h1 className="text-xl font-extrabold tracking-wide font-sans">
            Gharkul
          </h1>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 hover:bg-gray-800 px-4 py-2 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
              alt="Admin"
              className="h-9 w-9 rounded-full"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-white">Admin</span>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-gray-900 rounded-lg shadow-lg ring-1 ring-black/5 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-sm text-gray-500">admin@gmail.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-100 w-full text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
