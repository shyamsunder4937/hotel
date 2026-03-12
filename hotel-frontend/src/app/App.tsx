import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "./api";
import { HomePage } from "./components/hotel/HomePage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RoomSearch } from "./components/booking/RoomSearch";
import { RoomDetails } from "./components/booking/RoomDetails";
import { Checkout } from "./components/booking/Checkout";
import { MyBookings } from "./components/booking/MyBookings";
import { AuthPage } from "./components/auth/AuthPage";
import { User, LogOut, Hotel, Search, Calendar } from "lucide-react";

type Page = "home" | "search" | "details" | "auth" | "checkout" | "mybookings" | "admin";

// Determine initial page from URL
function getPageFromPath(): Page {
  const path = window.location.pathname.toLowerCase();
  if (path === "/admin") return "admin";
  if (path === "/rooms" || path === "/search") return "search";
  if (path === "/login" || path === "/signin") return "auth";
  if (path === "/mybookings" || path === "/my-stay") return "mybookings";
  return "home";
}

export default function App() {
  const [currentPage, setCurrentPageState] = useState<Page>(getPageFromPath());
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState({ checkIn: "", checkOut: "", guests: 2 });
  const [, forceUpdate] = useState(0);

  // Sync page state with browser URL
  const setCurrentPage = (page: Page) => {
    const pathMap: Record<Page, string> = {
      home: "/", search: "/rooms", details: "/rooms", auth: "/login",
      checkout: "/checkout", mybookings: "/my-stay", admin: "/admin"
    };
    window.history.pushState({}, "", pathMap[page]);
    setCurrentPageState(page);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => setCurrentPageState(getPageFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const user = getCurrentUser();
  const isLoggedIn = !!user;

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
    setCurrentPage("details");
  };

  const handleBookRoom = (dates?: { checkIn: string; checkOut: string; guests: number }) => {
    if (dates) setBookingDates(dates);
    // If not logged in, go to auth page first
    if (!getCurrentUser()) {
      setCurrentPage("auth");
    } else {
      setCurrentPage("checkout");
    }
  };

  const handleAuthSuccess = () => {
    forceUpdate(n => n + 1);
    // If they were trying to book, send them to checkout
    if (selectedRoom) {
      setCurrentPage("checkout");
    } else {
      setCurrentPage("mybookings");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setSelectedRoom(null);
    forceUpdate(n => n + 1);
    setCurrentPage("home");
  };

  // Admin page is separate (has its own login)
  if (currentPage === "admin") {
    return (
      <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <AdminDashboard />
        <button onClick={() => setCurrentPage("home")}
          className="fixed bottom-6 right-6 z-[100] bg-white shadow-lg rounded-lg px-4 py-2 border border-gray-200 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          ← Back to Site
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => setCurrentPage("home")} className="flex items-center gap-2">
            <h1 className="text-2xl tracking-wider text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Grand Horizon
            </h1>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage("home")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentPage === "home" ? "text-[#d4af37] bg-[#d4af37]/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              <Hotel size={16} /> Home
            </button>
            <button onClick={() => setCurrentPage("search")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentPage === "search" || currentPage === "details" ? "text-[#d4af37] bg-[#d4af37]/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              <Search size={16} /> Rooms
            </button>

            {isLoggedIn && user?.role === "customer" && (
              <button onClick={() => setCurrentPage("mybookings")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  currentPage === "mybookings" ? "text-[#d4af37] bg-[#d4af37]/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                <Calendar size={16} /> My Stay
              </button>
            )}




            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-[#d4af37] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => setCurrentPage("auth")}
                className="px-5 py-2 bg-[#d4af37] text-black rounded-lg text-sm hover:bg-[#c49d2e] transition-colors flex items-center gap-2">
                <User size={16} /> Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[60px]"></div>

      {/* ═══ PAGES ═══ */}
      {currentPage === "home" && <HomePage onSearch={() => setCurrentPage("search")} />}
      {currentPage === "search" && <RoomSearch onSelectRoom={handleSelectRoom} />}
      {currentPage === "details" && <RoomDetails room={selectedRoom} onBook={handleBookRoom} />}
      {currentPage === "auth" && <AuthPage onAuth={handleAuthSuccess} />}
      {currentPage === "checkout" && (
        <Checkout
          room={selectedRoom}
          checkIn={bookingDates.checkIn}
          checkOut={bookingDates.checkOut}
          guests={bookingDates.guests}
          onSuccess={() => setCurrentPage("mybookings")}
        />
      )}
      {currentPage === "mybookings" && <MyBookings onLogout={handleLogout} />}
    </div>
  );
}
