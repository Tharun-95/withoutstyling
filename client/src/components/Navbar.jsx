import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, AlertCircle, LayoutDashboard, Menu, X, CheckSquare, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/home', icon: <MapPin className="w-5 h-5 mr-1" /> },
    { name: 'Report Issue', path: '/report', icon: <AlertCircle className="w-5 h-5 mr-1" /> },
    { name: 'Map View', path: '/map', icon: <MapPin className="w-5 h-5 mr-1" /> },
    { name: 'Admin', path: '/admin', icon: <LayoutDashboard className="w-5 h-5 mr-1" /> },
  ];

  const isActive = (path) => {
    return location.pathname === path ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:text-primary-600 hover:bg-gray-50";
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary-500/30">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">CivicResolve</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="ml-4 flex items-center px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-500/30 transition-all duration-200"
            >
              Sign In <LogIn className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center block px-3 py-3 rounded-lg text-base font-medium ${isActive(link.path)}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center block px-3 py-3 mt-2 rounded-lg text-base font-bold text-primary-700 bg-primary-50 hover:bg-primary-100"
          >
            <LogIn className="w-5 h-5 mr-1" />
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
