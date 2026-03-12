import { useState, useEffect } from "react";
import {
  Hotel, Calendar, UtensilsCrossed, SprayCan, Wrench, Star,
  Phone, CheckCircle, Clock, MessageSquare, LogOut, DoorOpen
} from "lucide-react";
import {
  getMyBookings, requestRoomService, submitFeedback, getCurrentUser, logoutUser, checkOutBooking
} from "../../api";

interface MyBookingsProps {
  onLogout: () => void;
}

const serviceOptions = [
  { type: "food", label: "Room Dining", icon: UtensilsCrossed, desc: "Order food & beverages to your room" },
  { type: "cleaning", label: "Room Cleaning", icon: SprayCan, desc: "Request housekeeping service" },
  { type: "laundry", label: "Laundry Service", icon: Hotel, desc: "Pick up & deliver your laundry" },
  { type: "maintenance", label: "Maintenance", icon: Wrench, desc: "Report AC, plumbing or other issues" },
  { type: "other", label: "Call Front Desk", icon: Phone, desc: "Any other requests or assistance" },
];

export function MyBookings({ onLogout }: MyBookingsProps) {
  const user = getCurrentUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  // Service request states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceSuccess, setServiceSuccess] = useState("");

  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
      // Auto-select the active/confirmed booking
      const active = data.find((b: any) => b.status === "confirmed" || b.status === "checked-in");
      if (active) setActiveBooking(active);
      else if (data.length > 0) setActiveBooking(data[0]);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
    setLoading(false);
  };

  const handleServiceRequest = async () => {
    if (!activeBooking || !selectedService) return;
    setServiceLoading(true);
    try {
      await requestRoomService({
        booking: activeBooking._id,
        serviceType: selectedService,
        description: serviceDesc,
      });
      setServiceSuccess("Service request submitted! Our team will attend to you shortly.");
      setServiceDesc("");
      setSelectedService("");
      setTimeout(() => { setServiceSuccess(""); setShowServiceModal(false); }, 3000);
    } catch (err: any) {
      alert(err.message || "Failed to submit service request");
    }
    setServiceLoading(false);
  };

  const handleFeedback = async () => {
    if (!activeBooking) return;
    setFeedbackLoading(true);
    try {
      await submitFeedback({
        booking: activeBooking._id,
        rating: feedbackRating,
        comment: feedbackComment,
      });
      setFeedbackSuccess("Thank you for your feedback!");
      setFeedbackComment("");
      setTimeout(() => { setFeedbackSuccess(""); setShowFeedback(false); }, 3000);
    } catch (err: any) {
      alert(err.message || "Failed to submit feedback");
    }
    setFeedbackLoading(false);
  };

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          My Stay
        </h2>
        <p className="text-gray-600 mb-10">Manage your bookings and request services</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
            <Hotel size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500">Search for rooms and make your first booking!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Active Booking Info */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Your Bookings</h3>
              {bookings.map((b: any) => (
                <button key={b._id} onClick={() => setActiveBooking(b)}
                  className={`w-full text-left bg-white rounded-xl p-5 border-2 transition-all ${
                    activeBooking?._id === b._id ? "border-[#d4af37] shadow-md" : "border-gray-100 hover:border-gray-200"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg text-gray-900 capitalize">
                      {b.room?.type || "Room"} #{b.room?.roomNumber || "—"}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.status === "confirmed" ? "bg-green-100 text-green-700" :
                      b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "checked-in" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{b.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Check-in: {new Date(b.checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(b.checkOut).toLocaleDateString()}</p>
                    <p className="text-gray-900 font-medium">₹{b.totalAmount?.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right — Services & Actions */}
            <div className="lg:col-span-2 space-y-8">
              {activeBooking && (
                <>
                  {/* Booking Status Card */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-3xl text-gray-900 capitalize" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {activeBooking.room?.type || "Room"} #{activeBooking.room?.roomNumber || "—"}
                        </h3>
                        <p className="text-gray-500 mt-1">Confirmation: {activeBooking.confirmationCode || activeBooking._id?.slice(-8)}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
                        activeBooking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        activeBooking.status === "checked-in" ? "bg-blue-100 text-blue-700" :
                        activeBooking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {activeBooking.status === "confirmed" && <CheckCircle size={16} />}
                        {activeBooking.status === "pending" && <Clock size={16} />}
                        {activeBooking.status.charAt(0).toUpperCase() + activeBooking.status.slice(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-in</p>
                        <p className="text-gray-900 font-medium">{new Date(activeBooking.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">After 3:00 PM</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-out</p>
                        <p className="text-gray-900 font-medium">{new Date(activeBooking.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">Before 12:00 PM</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
                        <p className="text-gray-900 font-medium">₹{activeBooking.totalAmount?.toLocaleString()}</p>
                        <p className={`text-xs ${activeBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {activeBooking.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    {(activeBooking.status === "confirmed" || activeBooking.status === "checked-in") && (
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to check out?")) {
                            try {
                              await checkOutBooking(activeBooking._id);
                              fetchBookings();
                            } catch (err: any) { alert(err.message || "Checkout failed"); }
                          }
                        }}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors text-lg">
                        <DoorOpen size={20} /> Check Out
                      </button>
                    )}
                  </div>

                  {/* Room Services — matches backend: food, laundry, cleaning, maintenance, other */}
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Room Services
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {serviceOptions.map(svc => {
                        const Icon = svc.icon;
                        return (
                          <button key={svc.type}
                            onClick={() => { setSelectedService(svc.type); setShowServiceModal(true); setServiceSuccess(""); }}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#d4af37] hover:shadow-md transition-all text-left group">
                            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                              <Icon size={24} className="text-[#d4af37]" />
                            </div>
                            <h4 className="text-gray-900 font-medium mb-1">{svc.label}</h4>
                            <p className="text-gray-500 text-xs">{svc.desc}</p>
                          </button>
                        );
                      })}

                      {/* Feedback button */}
                      <button onClick={() => { setShowFeedback(true); setFeedbackSuccess(""); }}
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#d4af37] hover:shadow-md transition-all text-left group">
                        <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                          <MessageSquare size={24} className="text-[#d4af37]" />
                        </div>
                        <h4 className="text-gray-900 font-medium mb-1">Leave Feedback</h4>
                        <p className="text-gray-500 text-xs">Share your experience with us</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Request Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl text-gray-900 mb-6 capitalize">
              {serviceOptions.find(s => s.type === selectedService)?.label || "Service Request"}
            </h3>
            {serviceSuccess ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-green-700">{serviceSuccess}</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="text-sm text-gray-600 mb-2 block">Details / Notes</label>
                  <textarea value={serviceDesc} onChange={e => setServiceDesc(e.target.value)}
                    placeholder="Tell us what you need..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowServiceModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleServiceRequest} disabled={serviceLoading}
                    className="flex-1 px-4 py-3 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors disabled:opacity-50">
                    {serviceLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl text-gray-900 mb-6">Leave Feedback</h3>
            {feedbackSuccess ? (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto text-[#d4af37] mb-4" />
                <p className="text-green-700">{feedbackSuccess}</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="text-sm text-gray-600 mb-3 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setFeedbackRating(r)}
                        className="transition-transform hover:scale-110">
                        <Star size={32}
                          className={r <= feedbackRating ? "text-[#d4af37]" : "text-gray-300"}
                          fill={r <= feedbackRating ? "#d4af37" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm text-gray-600 mb-2 block">Comments</label>
                  <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowFeedback(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleFeedback} disabled={feedbackLoading}
                    className="flex-1 px-4 py-3 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors disabled:opacity-50">
                    {feedbackLoading ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
