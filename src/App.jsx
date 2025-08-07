import React, { useState, useEffect } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [searchParams, setSearchParams] = useState({
    from: "New York",
    to: "London",
    date: new Date().toISOString().split("T")[0],
    passengers: 1,
    class: "economy",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Mock flight data
  const mockFlights = [
    {
      id: 1,
      airline: "SkyWings",
      flightNumber: "SW101",
      from: "New York",
      to: "London",
      departure: "2023-12-01T08:00:00",
      arrival: "2023-12-01T20:30:00",
      duration: "7h 30m",
      price: 499,
      class: "economy",
      seatsAvailable: 12,
      status: "on-time",
      image: "https://placehold.co/80x80/3b82f6/ffffff?text=SW",
    },
    {
      id: 2,
      airline: "Global Air",
      flightNumber: "GA205",
      from: "New York",
      to: "London",
      departure: "2023-12-01T14:15:00",
      arrival: "2023-12-01T22:45:00",
      duration: "8h 30m",
      price: 399,
      class: "economy",
      seatsAvailable: 5,
      status: "delayed",
      delayMinutes: 45,
      image: "https://placehold.co/80x80/10b981/ffffff?text=GA",
    },
    {
      id: 3,
      airline: "Elite Airways",
      flightNumber: "EA301",
      from: "New York",
      to: "London",
      departure: "2023-12-01T19:30:00",
      arrival: "2023-12-02T07:00:00",
      duration: "7h",
      price: 699,
      class: "business",
      seatsAvailable: 8,
      status: "on-time",
      image: "https://placehold.co/80x80/f59e0b/ffffff?text=EA",
    },
    {
      id: 4,
      airline: "QuickFly",
      flightNumber: "QF412",
      from: "New York",
      to: "London",
      departure: "2023-12-01T06:45:00",
      arrival: "2023-12-01T18:15:00",
      duration: "6h 30m",
      price: 549,
      class: "premium",
      seatsAvailable: 15,
      status: "on-time",
      image: "https://placehold.co/80x80/ef4444/ffffff?text=QF",
    },
  ];

  // Mock booking data
  const mockBookings = [
    {
      id: 1001,
      userId: 1,
      flightId: 1,
      bookingDate: "2023-11-25",
      status: "confirmed",
      passengers: 2,
      totalAmount: 998,
      pnr: "SW101ABC",
      email: "user@example.com",
      phone: "+1234567890",
      alertsEnabled: true,
    },
  ];

  useEffect(() => {
    setFlights(mockFlights);
    setBookings(mockBookings);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockFlights.filter(
        (flight) =>
          flight.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
          flight.to.toLowerCase().includes(searchParams.to.toLowerCase()) &&
          flight.departure.startsWith(searchParams.date)
      );
      setFlights(filtered);
      setLoading(false);
      showNotification(`Found ${filtered.length} flights`);
    }, 800);
  };

  const handleBookFlight = (flight) => {
    const newBooking = {
      id: bookings.length + 1000,
      userId: 1,
      flightId: flight.id,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "confirmed",
      passengers: parseInt(searchParams.passengers),
      totalAmount: flight.price * searchParams.passengers,
      pnr: `BK${flight.id}${Math.floor(1000 + Math.random() * 9000)}`,
      email: "user@example.com",
      phone: "+1234567890",
      alertsEnabled: true,
    };

    setBookings([newBooking, ...bookings]);
    showNotification(`Successfully booked flight ${flight.flightNumber}!`);
    setActiveTab("bookings");
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "on-time": return "text-green-600 bg-green-100";
      case "delayed": return "text-orange-600 bg-orange-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // ✅ UPDATED: Send SMS via your live backend (fixes 20003 error)
  const sendDelayAlert = async (flight) => {
    try {
      const response = await fetch("https://skybook-backend.onrender.com/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flightNumber: flight.flightNumber }),
      });

      const data = await response.json();
      if (data.success) {
        showNotification(`✅ SMS alert sent for ${flight.flightNumber}`);
      } else {
        showNotification("❌ Failed to send SMS");
        console.error("SMS Error:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
      showNotification("❌ Server not reachable. Is backend running?");
    }
  };

  const handleLogin = () => {
    setUser({ name: "Akash M", email: "Akashnarmu06@gmail.com" });
    showNotification("Logged in successfully!");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("search");
    showNotification("Logged out successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SkyBook</h1>
                <p className="text-sm text-gray-600">Smart Flight Booking</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "search"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Search Flights
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "bookings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Admin
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-Time Alert Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl mb-8 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a6 6 0 00-6-6H9a6 6 0 00-6 6v10a6 6 0 006 6h6a6 6 0 006-6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Real-Time Flight Alerts</h2>
              <p className="text-orange-100">
                We monitor your flights and send SMS alerts for delays, gate changes, and cancellations
              </p>
            </div>
            <div className="ml-auto bg-white text-red-500 px-4 py-2 rounded-lg font-bold">
              LIVE
            </div>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Flight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Departure city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <input
                    type="text"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Destination city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                  <select
                    value={searchParams.passengers}
                    onChange={(e) => setSearchParams({...searchParams, passengers: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={searchParams.class}
                    onChange={(e) => setSearchParams({...searchParams, class: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search Flights</span>
                  </>
                )}
              </button>
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {flights.length} Flights Found
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>On Time</span>
                  <div className="w-3 h-3 bg-orange-500 rounded-full ml-4"></div>
                  <span>Delayed</span>
                </div>
              </div>

              {flights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      {/* Airline & Flight Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <img 
                          src={flight.image} 
                          alt={flight.airline}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-bold text-gray-900">{flight.airline}</h4>
                            <span className="text-gray-500 font-medium">{flight.flightNumber}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                              {flight.status === "delayed" ? `Delayed +${flight.delayMinutes}m` : flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>{flight.class.charAt(0).toUpperCase() + flight.class.slice(1)} Class</span>
                            <span>{flight.seatsAvailable} seats left</span>
                          </div>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="font-bold text-lg text-gray-900">{formatTime(flight.departure)}</div>
                          <div className="text-sm text-gray-600">{flight.from}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">{formatTime(flight.arrival)}</div>
                          <div className="text-sm text-gray-600">{flight.to}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => handleBookFlight(flight)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Book Now</span>
                      </button>
                      <button
                        onClick={() => sendDelayAlert(flight)}
                        type="button"
                        className="ml-3 border border-orange-500 text-orange-600 px-4 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm"
                      >
                        Send Test SMS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                Real-Time Monitoring Active
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">Your flight bookings will appear here</p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book a Flight
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const flight = flights.find(f => f.id === booking.flightId);
                  if (!flight) return null;

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                      <div className="flex flex-col lg:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <img 
                              src={flight.image} 
                              alt={flight.airline}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{flight.airline} {flight.flightNumber}</h3>
                              <p className="text-gray-600">{formatDate(flight.departure)} • {booking.passengers} passenger(s)</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                              <div className="text-sm text-gray-500">Departure</div>
                              <div className="font-semibold text-gray-900">{formatTime(flight.departure)}</div>
                              <div className="text-gray-600">{flight.from}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Arrival</div>
                              <div className="font-semibold text-gray-900">{formatTime(flight.arrival)}</div>
                              <div className="text-gray-600">{flight.to}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Status</div>
                              <div className={`font-semibold ${
                                flight.status === 'on-time' ? 'text-green-600' : 
                                flight.status === 'delayed' ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {flight.status === "delayed" ? `Delayed +${flight.delayMinutes}m` : flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                              </div>
                              <div className="text-gray-600">PNR: {booking.pnr}</div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:ml-8 text-right">
                          <div className="text-3xl font-bold text-gray-900 mb-2">${booking.totalAmount}</div>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                              Download Ticket
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                              Cancel Booking
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Real-Time Alert Status */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-medium">
                            Real-time SMS alerts enabled for flight status changes
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === "admin" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Bookings</p>
                      <p className="text-3xl font-bold">{bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.879-1.13M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Revenue</p>
                      <p className="text-3xl font-bold">${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}</p>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Active Alerts</p>
                      <p className="text-3xl font-bold">{bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a6 6 0 00-6-6H9a6 6 0 00-6 6v10a6 6 0 006 6h6a6 6 0 006-6z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Alert System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Flight Monitoring Service</span>
                    </div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Twilio SMS Integration</span>
                    </div>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">AviationStack API</span>
                    </div>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">SkyBook</h3>
              </div>
              <p className="text-gray-400 mb-4">
                The smart way to book flights with real-time delay alerts and instant notifications.
                Never miss a flight again with our advanced monitoring system.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Home</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Search Flights</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">My Bookings</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 SkyBook. All rights reserved. Real-time flight monitoring powered by Twilio and AviationStack API.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;