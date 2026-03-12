import { SlidersHorizontal, Star, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface RoomSearchProps {
  onSelectRoom: (room: any) => void;
}

const fallbackRooms = [
  {
    id: 1,
    name: "Deluxe Ocean View Room",
    description: "Spacious room with stunning ocean views, king-size bed, and modern amenities",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
    price: 450,
    rating: 4.8,
    tags: ["Free Cancellation", "Breakfast Included"],
    guests: 2,
    bed: "1 King Bed"
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "Luxurious suite with separate living area, premium furnishings, and city views",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
    price: 650,
    rating: 4.9,
    tags: ["Free Cancellation", "Airport Shuttle"],
    guests: 3,
    bed: "1 King Bed + Sofa"
  },
  {
    id: 3,
    name: "Presidential Suite",
    description: "The ultimate in luxury with private terrace, Jacuzzi, and personalized service",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
    price: 1200,
    rating: 5.0,
    tags: ["Free Cancellation", "Breakfast Included", "Butler Service"],
    guests: 4,
    bed: "2 King Beds"
  }
];

export function RoomSearch({ onSelectRoom }: RoomSearchProps) {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [rooms, setRooms] = useState(fallbackRooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        if (response.ok) {
          const data = await response.json();
          // Only show available rooms to customers
          const availableRooms = data.filter((r: any) => r.status === "available");
          if (availableRooms && availableRooms.length > 0) {
            setRooms(availableRooms.map((r: any) => ({
              ...r,  // keep full backend object (_id, type, roomNumber, price, amenities, description, images, status)
              id: r._id,
              name: `${r.type ? r.type.charAt(0).toUpperCase() + r.type.slice(1) : 'Deluxe'} - #${r.roomNumber || 'Room'}`,
              description: r.description || "Spacious room with stunning views, premium bed, and modern amenities.",
              image: (r.images && r.images.length > 0) ? r.images[0] : fallbackRooms[0].image,
              price: r.price,
              rating: 4.8,
              tags: r.amenities && r.amenities.length > 0 ? r.amenities : ["Free Cancellation"],
              guests: r.type === 'suite' ? 4 : r.type === 'single' ? 1 : 2,
              bed: r.type === 'suite' ? "2 King Beds" : "1 King Bed"
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching rooms. Mock data used instead.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search Modifier Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 flex-wrap">
            <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
            <span className="text-gray-400">→</span>
            <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
            </select>
            <button className="px-6 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors">
              Update Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={20} className="text-[#d4af37]" />
                <h3 className="text-lg">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4">Room Type</h4>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Deluxe</span>
                </label>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Suite</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Presidential</span>
                </label>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4">Amenities</h4>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Ocean View</span>
                </label>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Breakfast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]" />
                  <span className="text-sm text-gray-700">Free WiFi</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Room List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">{rooms.length} rooms available</p>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Image Gallery */}
                  <div className="md:w-2/5 relative group">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Room Details */}
                  <div className="md:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <span>{room.guests} Guests</span>
                            <span>•</span>
                            <span>{room.bed}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#d4af37] text-black px-3 py-1 rounded-lg">
                          <Star size={16} fill="currentColor" />
                          <span>{room.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, index) => (
                          <span key={index} className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                            <Check size={14} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-4xl text-gray-900">${room.price}</span>
                        <span className="text-gray-500 text-sm ml-1">/night</span>
                      </div>
                      <button
                        onClick={() => onSelectRoom(room)}
                        className="px-8 py-3 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors"
                      >
                        Select Room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
