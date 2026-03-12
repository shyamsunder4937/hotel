import { Users, Wifi, Tv, Coffee, Wind, Star, Calendar, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";

interface RoomDetailsProps {
  room?: any;
  onBook: (dates?: { checkIn: string; checkOut: string; guests: number }) => void;
}

// Fallback images if room has none
const fallbackImages = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070",
];

const defaultAmenities = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Tv, label: "Smart TV" },
  { icon: Coffee, label: "Coffee Maker" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Users, label: "Minibar" },
  { icon: Star, label: "Premium Bedding" },
];

export function RoomDetails({ room, onBook }: RoomDetailsProps) {
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Use room data from backend or fallback for demo
  const roomType = room?.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : "Deluxe";
  const roomNumber = room?.roomNumber || "";
  const roomPrice = room?.price || 0;
  const roomDescription = room?.description || "Experience ultimate comfort in this spacious retreat. The room features contemporary furnishings, premium amenities, and stunning views.";
  const roomImages = room?.images?.length > 0 ? room.images : fallbackImages;
  const roomAmenities = room?.amenities?.length > 0
    ? room.amenities.map((a: string) => ({ icon: Star, label: a }))
    : defaultAmenities;

  // Calculate nights & total
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalAmount = roomPrice * nights;

  const handleBook = () => {
    onBook({ checkIn, checkOut, guests });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 row-span-2">
            <ImageWithFallback src={roomImages[0]} alt="Main room view" className="w-full h-full object-cover rounded-2xl" />
          </div>
          {roomImages.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="col-span-1">
              <ImageWithFallback src={img} alt={`Room detail ${i + 1}`} className="w-full h-full object-cover rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h2 className="text-5xl text-gray-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {roomType} Room {roomNumber && `#${roomNumber}`}
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1"><Users size={18} />{guests} Guests</span>
                <span>•</span>
                <span className="capitalize">{room?.type || "deluxe"}</span>
                {roomPrice > 0 && (
                  <>
                    <span>•</span>
                    <span>₹{roomPrice.toLocaleString()}/night</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl text-gray-900 mb-4">About This Room</h3>
              <p className="text-gray-600 leading-relaxed">{roomDescription}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl text-gray-900 mb-6">Room Amenities</h3>
              <div className="grid grid-cols-2 gap-6">
                {roomAmenities.map((amenity: any, index: number) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-[#d4af37]" />
                      </div>
                      <span className="text-gray-700">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl text-gray-900 mb-6">Policies</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-[#d4af37] mt-1" />
                  <div>
                    <p className="mb-1">Check-in: After 3:00 PM</p>
                    <p>Check-out: Before 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star size={20} className="text-[#d4af37] mt-1" />
                  <p>Free cancellation up to 48 hours before check-in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl text-gray-900">₹{roomPrice.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">/night</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="capitalize">{room?.status === "available" ? "✅ Available" : room?.status || "—"}</span>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Check-in</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Check-out</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Guests</label>
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="text-gray-900">{guests} Guests</span>
                    <button onClick={() => setGuests(Math.min(4, guests + 1))}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{roomPrice.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              {nights > 0 && (
                <div className="flex justify-between text-xl text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={!checkIn || !checkOut || !room}
                className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-4 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </button>

              {!room && (
                <p className="text-center text-xs text-red-500 mt-4">
                  Please select a room from the search page first.
                </p>
              )}
              {room && (!checkIn || !checkOut) && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  Select check-in and check-out dates to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
