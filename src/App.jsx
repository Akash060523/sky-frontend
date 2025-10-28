// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Login from "./Login";
import PhoneRegistration from "./PhoneRegistration";
import Home from "./pages/Home";
import { MyBookings } from "./pages/MyBookings";
import { Contact } from "./pages/Contact";
import { Faq } from "./pages/Faq";
import { Offers } from "./pages/Offers";

/* -----------------------
   Animated page wrapper
   ----------------------- */
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/* -----------------------
   Top nav link component
   ----------------------- */
const NavLink = ({ to, children, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative px-4 py-2 text-sm font-semibold transition-all duration-200"
      aria-current={isActive ? "page" : undefined}
    >
      <span className={`${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
};

/* -----------------------
   AppContent
   ----------------------- */
const AppContent = () => {
  const location = useLocation();

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Backend URL helper
  const getBackendUrl = () => {
    const raw = import.meta.env.VITE_BACKEND_URL || "https://skybook-backend.onrender.com";
    return raw.trim().replace(/\/+$/, "");
  };

  // Mock flights with varied statuses
  const mockFlights = [
    {
      id: 1,
      flightNumber: "6E-2045",
      airline: "IndiGo",
      from: "Delhi",
      to: "Mumbai",
      departure: "06:30 AM",
      arrival: "08:45 AM",
      duration: "2h 15m",
      price: 4500,
      status: "on-time"
    },
    {
      id: 2,
      flightNumber: "AI-860",
      airline: "Air India",
      from: "Mumbai",
      to: "Dubai",
      departure: "10:15 AM",
      arrival: "12:30 PM",
      duration: "3h 15m",
      price: 18500,
      status: "on-time"
    },
    {
      id: 3,
      flightNumber: "SG-116",
      airline: "SpiceJet",
      from: "Bangalore",
      to: "Chennai",
      departure: "02:45 PM",
      arrival: "03:50 PM",
      duration: "1h 05m",
      price: 3200,
      status: "delayed"
    },
    {
      id: 4,
      flightNumber: "UK-955",
      airline: "Vistara",
      from: "Delhi",
      to: "London",
      departure: "08:00 PM",
      arrival: "12:30 AM",
      duration: "9h 30m",
      price: 45000,
      status: "cancelled"
    },
    {
      id: 5,
      flightNumber: "6E-5074",
      airline: "IndiGo",
      from: "Hyderabad",
      to: "Pune",
      departure: "04:20 PM",
      arrival: "05:45 PM",
      duration: "1h 25m",
      price: 3800,
      status: "delayed"
    },
    {
      id: 6,
      flightNumber: "AI-191",
      airline: "Air India",
      from: "Chennai",
      to: "Singapore",
      departure: "11:30 PM",
      arrival: "06:15 AM",
      duration: "4h 45m",
      price: 22000,
      status: "on-time"
    }
  ];

  // Mock bookings data
  const mockBookings = [
    {
      id: "BK-2025-001",
      flightNumber: "6E-2045",
      from: "Delhi",
      to: "Mumbai",
      date: "2025-11-15",
      passengerName: "John Doe",
      status: "on-time",
      bookedAt: "2025-10-20T10:30:00Z"
    },
    {
      id: "BK-2025-002",
      flightNumber: "AI-860",
      from: "Mumbai",
      to: "Dubai",
      date: "2025-12-05",
      passengerName: "John Doe",
      status: "on-time",
      bookedAt: "2025-10-22T14:15:00Z"
    },
    {
      id: "BK-2025-003",
      flightNumber: "SG-116",
      from: "Bangalore",
      to: "Chennai",
      date: "2025-10-10",
      passengerName: "John Doe",
      status: "delayed",
      bookedAt: "2025-09-28T09:20:00Z"
    }
  ];

  // Init flights
  useEffect(() => {
    setFlights(mockFlights);
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      if (usr) {
        setUser({
          uid: usr.uid,
          email: usr.email,
          displayName: usr.displayName || usr.email
        });
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        const adminUids = (import.meta.env.VITE_ADMIN_UIDS || '').split(',').map(s => s.trim()).filter(Boolean);
        setIsAdmin(adminEmails.includes((usr.email || '').toLowerCase()) || adminUids.includes(usr.uid));
        loadUserBookings();
      } else {
        setUser(null);
        setBookings([]);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check backend status
  const checkBackendStatus = async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/`, { 
        method: "GET", 
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined 
      });
      setBackendStatus(response.ok ? "online" : "error");
    } catch {
      setBackendStatus("offline");
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load user bookings
  const loadUserBookings = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        // Use mock bookings if backend fails
        setBookings(mockBookings);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      // Use mock bookings on error
      setBookings(mockBookings);
    }
  };

  // Book flight
  const handleBookFlight = async (flight) => {
    if (!user) {
      showNotification("Please log in to book flights");
      setShowLogin(true);
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = getBackendUrl();
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
        showNotification(`✅ Flight ${flight.flightNumber} booked successfully!`);
        loadUserBookings();
      } else {
        showNotification("❌ Failed to book flight. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("❌ Network error. Please try again.");
    }
  };

  // Check flight status
  const checkFlightStatus = async (flightNumber) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/flight-status/${flightNumber}`);
      if (response.ok) {
        const data = await response.json();
        showNotification(`📊 ${flightNumber}: ${data.flight.status} (${data.flight.airline})`);
      } else {
        showNotification(`❌ Could not get status for ${flightNumber}`);
      }
    } catch (error) {
      console.error("Flight status error:", error);
      showNotification(`❌ Error checking ${flightNumber} status`);
    }
  };

  // Send SMS alert
  const sendDelayAlert = async (flight) => {
    if (!user) {
      showNotification("Please log in to send SMS alerts");
      setShowLogin(true);
      return;
    }
    try {
      showNotification("📱 Sending SMS alert...");
      const backendUrl = getBackendUrl();
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${backendUrl}/api/send-sms`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          flightNumber: flight.flightNumber,
          message: `🚨 SkyBook Alert: Flight ${flight.flightNumber} (${flight.from} → ${flight.to}) is ${flight.status.toUpperCase()}!`
        })
      });
      const data = await response.json();
      if (data.success) {
        showNotification(`✅ SMS alert sent for flight ${flight.flightNumber}!`);
      } else {
        if (data.error === "Please register your phone number first") {
          showNotification("❌ Please register your phone number first");
          setShowPhoneRegistration(true);
        } else {
          showNotification(`❌ Failed to send SMS: ${data.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error("SMS error:", err);
      showNotification("❌ SMS service error. Please try again later.");
    }
  };

  // Load admin stats
  const loadAdminStats = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data.stats);
      } else if (response.status === 403) {
        showNotification("❌ Admin access required");
        setShowAdminDashboard(false);
      }
    } catch (error) {
      console.error("Admin stats error:", error);
    }
  };

  // Handlers
  const handleLogin = () => setShowLogin(true);
  const handleLoginSuccess = () => {
    const current = auth.currentUser;
    if (current) {
      setUser({ 
        uid: current.uid, 
        email: current.email, 
        displayName: current.displayName || current.email 
      });
      showNotification(`✅ Welcome back, ${current.displayName || current.email}!`);
    }
    setShowLogin(false);
  };
  const handleLoginClose = () => setShowLogin(false);
  const handlePhoneRegistrationSuccess = (phoneNumber) => {
    showNotification(`✅ Phone number ${phoneNumber} registered successfully!`);
    setShowPhoneRegistration(false);
  };
  const handlePhoneRegistrationClose = () => setShowPhoneRegistration(false);
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

  // FILTERED FLIGHTS
  const filteredFlights = flights.filter(flight =>
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "on-time": return "bg-green-100 text-green-800";
      case "delayed": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  // Backend status helpers
  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case "online": return "bg-green-500";
      case "offline": return "bg-red-500";
      case "error": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  /* -----------------------
     Render
     ----------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">✈</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  SkyBook
                </div>
                <div className="text-xs text-gray-500 -mt-1">Find. Book. Fly.</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" isActive={location.pathname === "/"}>
                Flights
              </NavLink>
              {user && (
                <NavLink to="/my-bookings" isActive={location.pathname === "/my-bookings"}>
                  My Bookings
                </NavLink>
              )}
              <NavLink to="/offers" isActive={location.pathname === "/offers"}>
                Offers
              </NavLink>
              <NavLink to="/faq" isActive={location.pathname === "/faq"}>
                Faq
              </NavLink>
              <NavLink to="/contact" isActive={location.pathname === "/contact"}>
                Contact
              </NavLink>
            </nav>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Backend Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${getBackendStatusColor()} animate-pulse`} />
                <span className="text-xs font-medium text-gray-700">
                  {backendStatus === "online" ? "Live" : "Offline"}
                </span>
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => setShowPhoneRegistration(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    📱 Phone
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={() => setShowAdminDashboard(true)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      📊 Admin
                    </button>
                  )}

                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{user.displayName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 py-4"
              >
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname === "/" 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Flights
                  </Link>
                  {user && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-2 rounded-lg ${
                        location.pathname === "/my-bookings" 
                          ? "bg-blue-50 text-blue-700 font-semibold" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      My Bookings
                    </Link>
                  )}
                  <Link
                    to="/offers"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname === "/offers" 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Offers
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname === "/faq" 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Faq
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname === "/contact" 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Contact
                  </Link>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="text-xs text-gray-500 mb-2 px-4">Account</div>
                    {user ? (
                      <>
                        <div className="px-4 py-2">
                          <div className="text-sm font-semibold text-gray-900">{user.displayName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            setShowPhoneRegistration(true);
                            setMobileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          📱 Phone Registration
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowAdminDashboard(true);
                              setMobileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            📊 Admin Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          handleLogin();
                          setMobileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl px-6 py-4 max-w-md"
          >
            <p className="text-sm font-medium text-gray-900">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home
                  flights={flights}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleBookFlight={handleBookFlight}
                  sendDelayAlert={sendDelayAlert}
                  checkFlightStatus={checkFlightStatus}
                  getStatusColor={getStatusColor}
                  filteredFlights={filteredFlights}
                />
              </AnimatedPage>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <AnimatedPage>
                <MyBookings bookings={bookings} getStatusColor={getStatusColor} />
              </AnimatedPage>
            }
          />
          <Route
            path="/offers"
            element={
              <AnimatedPage>
                <Offers />
              </AnimatedPage>
            }
          />
          <Route
            path="/faq"
            element={
              <AnimatedPage>
                <Faq />
              </AnimatedPage>
            }
          />
          <Route
            path="/contact"
            element={
              <AnimatedPage>
                <Contact />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 SkyBook. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ for travelers worldwide</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && <Login onSuccess={handleLoginSuccess} onClose={handleLoginClose} />}
      {showPhoneRegistration && (
        <PhoneRegistration 
          onSuccess={handlePhoneRegistrationSuccess} 
          onClose={handlePhoneRegistrationClose} 
        />
      )}

      {/* Admin Dashboard Modal */}
      {showAdminDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowAdminDashboard(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📊 Admin Dashboard</h2>
            
            <button
              onClick={loadAdminStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Load Statistics
            </button>

            {adminStats && (
              <div className="mt-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <pre className="text-xs text-gray-800 overflow-auto">
                    {JSON.stringify(adminStats, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* -----------------------
   App wrapper
   ----------------------- */
   export default function App() {
    return (
      <Router>
        <AppContent />
      </Router>
    );
  }