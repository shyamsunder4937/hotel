import { CreditCard, Lock, Calendar, MapPin, Smartphone, Building, Banknote, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";
import { createBooking, processPayment, getCurrentUser } from "../../api";

interface CheckoutProps {
  room?: any;       // room object from backend (or null for demo)
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  onSuccess?: () => void;
}

// Payment methods match backend: 'card', 'cash', 'upi', 'netbanking'
const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building },
  { id: "cash", label: "Pay at Hotel", icon: Banknote },
];

export function Checkout({ room, checkIn, checkOut, guests, onSuccess }: CheckoutProps) {
  // Booking state
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [transactionId, setTransactionId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check-in/out defaults
  const ci = checkIn || "";
  const co = checkOut || "";
  const roomPrice = room?.price || 0;
  const nights = ci && co ? Math.max(1, Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const totalAmount = roomPrice * nights;


  // Handle booking + payment submission
  const handlePayment = async () => {
    if (!room?._id || !ci || !co) {
      setError("Missing room or date information.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      // Step 1: Create booking (backend calculates totalAmount from room.price × nights)
      const booking = await createBooking(room._id, ci, co);

      // Step 2: Process payment (matches backend: bookingId, method, transactionId)
      await processPayment(booking._id, selectedMethod, transactionId || undefined);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Booking or payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl text-gray-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            A verification email has been sent to your email address. Please verify to complete the booking confirmation.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Room</span>
              <span className="text-gray-900">{room?.type ? `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} #${room.roomNumber}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="text-gray-900">{ci ? new Date(ci).toLocaleDateString() : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="text-gray-900">{co ? new Date(co).toLocaleDateString() : "—"}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium text-gray-900">Total Paid</span>
              <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">Check your email for the verification link and booking details.</p>
          {onSuccess && (
            <button onClick={onSuccess}
              className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-3 rounded-lg transition-colors text-lg">
              View My Bookings
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Complete Your Booking
        </h2>
        <p className="text-gray-600 mb-12">Just a few more details and you're all set</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Logged in user info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Booking as</p>
                <p className="text-lg text-gray-900">{getCurrentUser()?.name} ({getCurrentUser()?.email})</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>

            {/* Payment Method Selection — matches backend: card, upi, netbanking, cash */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Lock size={20} className="text-[#d4af37]" />
                <h3 className="text-2xl text-gray-900">Payment Method</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {paymentMethods.map(m => {
                  const Icon = m.icon;
                  return (
                    <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        selectedMethod === m.id
                          ? "border-[#d4af37] bg-[#d4af37]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <Icon size={24} className={selectedMethod === m.id ? "text-[#d4af37]" : "text-gray-400"} />
                      <span className={selectedMethod === m.id ? "text-gray-900 font-medium" : "text-gray-600"}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Card details only if card method */}
              {selectedMethod === "card" && (
                <div className="space-y-6">
                  <div className="relative bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-6 text-white">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <p className="text-xs text-white/60 mb-1">CARD HOLDER</p>
                        <p className="text-lg">{getCurrentUser()?.name || "Guest"}</p>
                      </div>
                      <CreditCard size={32} className="text-[#d4af37]" />
                    </div>
                    <p className="text-xs text-white/60">Secure Payment Processing</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Expiry Date</label>
                      <input type="text" placeholder="MM / YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">CVV</label>
                      <input type="text" placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI */}
              {selectedMethod === "upi" && (
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">UPI ID</label>
                  <input type="text" placeholder="yourname@upi" value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                </div>
              )}

              {/* Net Banking */}
              {selectedMethod === "netbanking" && (
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Select Bank</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Cash */}
              {selectedMethod === "cash" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                  <p>Payment will be collected at the hotel during check-in. Your booking will remain in "pending" status until payment is received.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 sticky top-8">
              <h3 className="text-2xl text-gray-900 mb-6">Booking Summary</h3>

              {/* Room Image */}
              {room?.images?.[0] && (
                <div className="mb-6">
                  <ImageWithFallback src={room.images[0]} alt="Room" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}

              {/* Room Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-xl text-gray-900 capitalize">
                  {room ? `${room.type} — #${room.roomNumber}` : "Select a room first"}
                </h4>
                {ci && co && (
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <Calendar size={18} className="text-[#d4af37] mt-0.5" />
                    <div>
                      <p>Check-in: {new Date(ci).toLocaleDateString()}</p>
                      <p>Check-out: {new Date(co).toLocaleDateString()}</p>
                      <p className="text-gray-900 mt-1">{nights} night{nights !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                )}
                {guests && (
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <MapPin size={18} className="text-[#d4af37] mt-0.5" />
                    <p>{guests} Guest{guests !== 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>₹{roomPrice.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-2xl text-gray-900 mb-8">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handlePayment}
                disabled={processing || !room || !ci || !co}
                className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-4 rounded-lg transition-colors text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : `Confirm & Pay ₹${totalAmount.toLocaleString()}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock size={14} />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
