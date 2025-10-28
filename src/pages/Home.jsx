// src/pages/Home.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home({ 
  flights, 
  searchQuery, 
  setSearchQuery, 
  handleBookFlight, 
  sendDelayAlert, 
  checkFlightStatus,
  getStatusColor,
  filteredFlights
}) {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  // Get delayed/cancelled flights
  const alertFlights = filteredFlights.filter(
    flight => flight.status === 'delayed' || flight.status === 'cancelled'
  );

  // Handle search
  const handleSearch = () => {
    // This could trigger actual search logic
    console.log('Searching flights:', { fromCity, toCity, departureDate, passengers });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Search, book, and stay updated with real-time flight alerts
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* From */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  placeholder="Delhi"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Departure
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Search Flights
            </button>
          </motion.div>

          {/* Quick Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <input
              type="text"
              placeholder="Quick search by flight number, airline, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-2xl w-full px-6 py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Available Flights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Available Flights</h2>
            <p className="text-gray-600 mt-1">Choose from {filteredFlights.length} flights</p>
          </div>
          <div className="text-sm text-gray-500">
            Updated just now
          </div>
        </div>

        {filteredFlights.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFlights.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Flight Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{flight.flightNumber}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{flight.airline}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(flight.status)}`}>
                      {flight.status}
                    </span>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="p-6">
                  {/* Route */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-gray-900">{flight.departure}</div>
                      <div className="text-sm text-gray-600 mt-1">{flight.from}</div>
                    </div>
                    
                    <div className="flex flex-col items-center px-4 flex-1">
                      <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                      <div className="w-full h-0.5 bg-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Direct</div>
                    </div>

                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-gray-900">{flight.arrival}</div>
                      <div className="text-sm text-gray-600 mt-1">{flight.to}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">per passenger</div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      Book Flight
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => sendDelayAlert(flight)}
                        className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors text-sm border border-green-200"
                      >
                        🔔 Set Alert
                      </button>
                      <button
                        onClick={() => checkFlightStatus(flight.flightNumber)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm border border-gray-200"
                      >
                        📊 Status
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-8xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </section>

      {/* Alert Flights Section */}
      {alertFlights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">⚠️ Flights Currently on Alert</h2>
                <p className="text-gray-700 mt-1">
                  {alertFlights.length} {alertFlights.length === 1 ? 'flight' : 'flights'} with status updates
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {alertFlights.map((flight) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{flight.flightNumber}</h3>
                      <p className="text-sm text-gray-600">{flight.airline}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(flight.status)} uppercase`}>
                      {flight.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-semibold text-gray-900">{flight.from} → {flight.to}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="font-semibold text-gray-900">{flight.departure} - {flight.arrival}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{flight.duration}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => sendDelayAlert(flight)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      📱 Send SMS Alert
                    </button>
                    <button
                      onClick={() => checkFlightStatus(flight.flightNumber)}
                      className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors border-2 border-gray-300"
                    >
                      Check
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* No Alerts Message */}
      {alertFlights.length === 0 && filteredFlights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 text-center"
          >
            <div className="inline-block bg-green-500 text-white rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">✅ All Flights On Schedule</h3>
            <p className="text-gray-700">No delays or cancellations at this time. Safe travels!</p>
          </motion.div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkyBook?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience hassle-free flight booking with real-time alerts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">Find the perfect flight with our intuitive search interface</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-4">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SMS Alerts</h3>
              <p className="text-gray-600">Get instant notifications about delays and gate changes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Status</h3>
              <p className="text-gray-600">Track your flights with live status updates</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}