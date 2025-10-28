import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const MyBookings = ({ bookings, getStatusColor }) => {
  const [filter, setFilter] = useState('all');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    if (filter === 'upcoming') return bookingDate >= today;
    if (filter === 'past') return bookingDate < today;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your flight reservations</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {['all', 'upcoming', 'past'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                filter === filterType
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Bookings
              {filterType === 'all' && ` (${bookings.length})`}
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="grid gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left: Flight Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {booking.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Booking ID: {booking.id}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{booking.from}</div>
                          <div className="text-sm text-gray-500 mt-1">Departure</div>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full h-0.5 bg-gray-300 relative">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-2">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{booking.to}</div>
                          <div className="text-sm text-gray-500 mt-1">Arrival</div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Passenger:</span>
                          <p className="font-semibold text-gray-900">{booking.passengerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Travel Date:</span>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Booked:</span>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.bookedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col gap-3 lg:w-48">
                      <button className="flex-1 lg:w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                        View Details
                      </button>
                      <button className="flex-1 lg:w-full bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border-2 border-gray-300">
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Need help with this booking?</span>
                    <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Contact Support →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-12 text-center"
          >
            <div className="text-gray-300 text-8xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-8">
              {filter === 'upcoming' && "You don't have any upcoming trips"}
              {filter === 'past' && "You don't have any past trips"}
              {filter === 'all' && "Start exploring flights and book your next adventure!"}
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Search Flights
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};