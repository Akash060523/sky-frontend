import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Login from "./Login";
import PhoneRegistration from "./PhoneRegistration";

function App() {
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showPhoneRegistration, setShowPhoneRegistration] = useState(false);
  const [notification, setNotification] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [bookings, setBookings] = useState([]);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminStats, setAdminStats] = useState(null);

  // Mock flight data
  const mockFlights = [
    {
      id: 1,
      flightNumber: "SW101",
      airline: "Southwest Airlines",
      from: "New York",
      to: "London",
      departure: "10:30 AM",
      arrival: "10:30 PM",
      price: 450,
      status: "on-time"
    },
    {
      id: 2,
      flightNumber: "GA205",
      airline: "Garuda Indonesia",
      from: "Jakarta",
      to: "Singapore",
      departure: "2:15 PM",
      arrival: "5:30 PM",
      price: 180,
      status: "on-time"
    },
    {
      id: 3,
      flightNumber: "BA789",
      airline: "British Airways",
      from: "London",
      to: "Paris",
      departure: "8:45 AM",
      arrival: "11:20 AM",
      price: 220,
      status: "delayed"
    }
  ];

  useEffect(() => {
    setFlights(mockFlights);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email
        });
        // Load user bookings after login
        loadUserBookings();
      } else {
        setUser(null);
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Check backend status
  const checkBackendStatus = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      const response = await fetch(`${backendUrl}/`, {
        method: "GET",
        signal: AbortSignal.timeout(5000)
      });
      setBackendStatus(response.ok ? "online" : "error");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Load user bookings
  const loadUserBookings = async () => {
    if (!user) return;
    
    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      const response = await fetch(`${backendUrl}/api/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };

  // Book a flight
  const handleBookFlight = async (flight) => {
    if (!user) {
      showNotification("Please log in to book flights");
      setShowLogin(true);
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      
      const response = await fetch(`${backendUrl}/api/book-flight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          flightNumber: flight.flightNumber,
          from: flight.from,
          to: flight.to,
          date: new Date().toISOString().split('T')[0],
          passengerName: user.displayName || "Passenger"
        })
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(`✅ Flight ${flight.flightNumber} booked successfully!`);
        loadUserBookings(); // Reload bookings
      } else {
        showNotification("❌ Failed to book flight. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("❌ Network error. Please try again.");
    }
  };

  // Check real flight status
  const checkFlightStatus = async (flightNumber) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      const response = await fetch(`${backendUrl}/api/flight-status/${flightNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        showNotification(`📊 ${flightNumber}: ${data.flight.status} (${data.flight.airline})`);
        return data.flight;
      } else {
        showNotification(`❌ Could not get status for ${flightNumber}`);
        return null;
      }
    } catch (error) {
      console.error("Flight status error:", error);
      showNotification(`❌ Error checking ${flightNumber} status`);
      return null;
    }
  };

  // Load admin stats
  const loadAdminStats = async () => {
    if (!user) return;
    
    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      const response = await fetch(`${backendUrl}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    showNotification(`✅ Welcome back, ${userData.displayName}!`);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handlePhoneRegistrationSuccess = (phoneNumber) => {
    showNotification(`✅ Phone number ${phoneNumber} registered successfully!`);
    setShowPhoneRegistration(false);
  };

  const handlePhoneRegistrationClose = () => {
    setShowPhoneRegistration(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification("👋 Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  // ✅ SECURE: Use backend for SMS (no direct Twilio calls)
  const sendDelayAlert = async (flight) => {
    if (!user) {
      showNotification("Please log in to send SMS alerts");
      setShowLogin(true);
      return;
    }

    try {
      // Show loading notification
      showNotification("📱 Sending SMS alert...");
      
      // First check if backend is reachable
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
        const healthCheck = await fetch(`${backendUrl}/`, {
          method: "GET",
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!healthCheck.ok) {
          throw new Error("Backend not responding");
        }
      } catch (healthError) {
        console.error("Backend health check failed:", healthError);
        showNotification("❌ Backend service unavailable. Please try again later.");
        return;
      }
      
      // Try legacy endpoint first (more reliable)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
      let response = await fetch(`${backendUrl}/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          flightNumber: flight.flightNumber,
          to: "+1234567890" // Default phone number
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      let data = await response.json();
      
      // If legacy endpoint works, show success
      if (data.success) {
        if (data.note && data.note.includes("simulation")) {
          showNotification(`✅ SMS alert simulated for flight ${flight.flightNumber}! (Twilio not configured)`);
        } else {
          showNotification(`✅ SMS alert sent for flight ${flight.flightNumber}!`);
        }
        return;
      }

      // If legacy fails, try authenticated endpoint
      try {
        const token = await auth.currentUser.getIdToken();
        
        response = await fetch(`${backendUrl}/api/send-sms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            flightNumber: flight.flightNumber,
            message: `🚨 SkyBook Alert: Flight ${flight.flightNumber} is DELAYED! Gate changed to B12.`
          }),
        });

        data = await response.json();
        
        if (data.success) {
          showNotification(`✅ SMS alert sent for flight ${flight.flightNumber}!`);
        } else {
          if (data.error === "Please register your phone number first") {
            showNotification("❌ Please register your phone number first");
            setShowPhoneRegistration(true);
          } else {
            showNotification(`❌ Failed to send SMS: ${data.error || 'Unknown error'}`);
            console.error("SMS Error:", data.error);
          }
        }
      } catch (authError) {
        console.error("Auth endpoint error:", authError);
        // If both endpoints fail, show a generic error
        showNotification("❌ SMS service temporarily unavailable. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      if (err.name === 'AbortError') {
        showNotification("❌ Request timeout. Please try again.");
      } else if (err.message.includes('Failed to fetch')) {
        showNotification("❌ Network error. Please check your connection and try again.");
      } else {
        showNotification("❌ SMS service error. Please try again later.");
      }
    }
  };

  const filteredFlights = flights.filter(flight =>
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "on-time": return "text-green-600";
      case "delayed": return "text-red-600";
      case "cancelled": return "text-gray-600";
      default: return "text-blue-600";
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case "online": return "text-green-600";
      case "offline": return "text-red-600";
      case "error": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case "online": return "LIVE";
      case "offline": return "OFFLINE";
      case "error": return "ERROR";
      default: return "CHECKING";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SkyBook</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Backend:</span>
                <span className={`text-sm font-medium ${getBackendStatusColor()}`}>
                  {getBackendStatusText()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome, {user.displayName}!
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setShowPhoneRegistration(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    📱 Register Phone
                  </button>
                  <button
                    onClick={() => setShowAdminDashboard(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    📊 Admin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-6 py-3">
          <p className="text-gray-800">{notification}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Flights</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by flight number, airline, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => checkFlightStatus("SW101")}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Check Status
              </button>
            </div>
          </div>
        </div>

        {/* User Bookings */}
        {user && bookings.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Bookings</h2>
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.flightNumber}</h3>
                        <p className="text-sm text-gray-600">{booking.from} → {booking.to}</p>
                        <p className="text-xs text-gray-500">Booked on {new Date(booking.bookedAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flights Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{flight.flightNumber}</h3>
                    <p className="text-gray-600">{flight.airline}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                    {flight.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{flight.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{flight.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">{flight.departure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span className="font-medium">{flight.arrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-green-600">${flight.price}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookFlight(flight)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Book Flight
                  </button>
                  <button
                    onClick={() => sendDelayAlert(flight)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Send Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No flights found */}
        {filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SkyBook</h3>
              <p className="text-gray-400">Your trusted partner for flight booking and real-time monitoring.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time flight status</li>
                <li>SMS delay alerts</li>
                <li>Secure booking system</li>
                <li>Mobile responsive</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Technologies</h3>
              <ul className="space-y-2 text-gray-400">
                <li>React & Vite</li>
                <li>Firebase Auth</li>
                <li>Twilio SMS</li>
                <li>AviationStack API</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2023 SkyBook. All rights reserved. Real-time flight monitoring powered by Twilio and AviationStack API.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <Login onSuccess={handleLoginSuccess} onClose={handleLoginClose} />
      )}

      {/* Phone Registration Modal */}
      {showPhoneRegistration && (
        <PhoneRegistration onSuccess={handlePhoneRegistrationSuccess} onClose={handlePhoneRegistrationClose} />
      )}

      {/* Admin Dashboard Modal */}
      {showAdminDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative">
            <button
              onClick={() => setShowAdminDashboard(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
              <p className="text-gray-600">Real-time system statistics and monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-blue-600 text-2xl font-bold">{adminStats?.totalUsers || 0}</div>
                <div className="text-blue-600 font-medium">Total Users</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-green-600 text-2xl font-bold">{adminStats?.totalBookings || 0}</div>
                <div className="text-green-600 font-medium">Total Bookings</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-purple-600 text-2xl font-bold">{adminStats?.smsConfigured ? "✅" : "❌"}</div>
                <div className="text-purple-600 font-medium">SMS Configured</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="text-orange-600 text-2xl font-bold">{adminStats?.aviationStackConfigured ? "✅" : "❌"}</div>
                <div className="text-orange-600 font-medium">Flight API</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={loadAdminStats}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;