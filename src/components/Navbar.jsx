// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <Link to="/" className="text-xl font-bold text-gray-900">SkyBook</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Flights
            </Link>
            <Link
              to="/my-bookings"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              My Bookings
            </Link>
            <Link
              to="/offers"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Offers
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              FAQ
            </Link>
          </div>

          {/* Mobile Menu Button (optional) */}
          <div className="md:hidden">
            <button className="text-gray-700">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
}