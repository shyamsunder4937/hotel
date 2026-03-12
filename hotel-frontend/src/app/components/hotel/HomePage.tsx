import { Search, MapPin, Calendar, Users, Wifi, Waves, Sparkles, Utensils } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomePageProps {
  onSearch: () => void;
}

export function HomePage({ onSearch }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070"
            alt="Luxury Hotel Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-white text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Experience Unmatched<br />Luxury
          </h2>
          <p className="text-white/90 text-xl mb-16 max-w-2xl">
            Discover the perfect blend of elegance, comfort, and world-class hospitality
          </p>

          {/* Glassmorphism Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} />
                  Location
                </label>
                <select className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Miami</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} />
                  Check-in
                </label>
                <input
                  type="date"
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} />
                  Check-out
                </label>
                <input
                  type="date"
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Users size={14} />
                  Guests
                </label>
                <select className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
            </div>

            <button
              onClick={onSearch}
              className="w-full mt-6 bg-[#d4af37] hover:bg-[#c49d2e] text-black font-medium py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wider uppercase"
            >
              <Search size={18} />
              Search Available Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4af37] text-sm tracking-[0.3em] uppercase mb-4">Our Rooms</p>
            <h3 className="text-5xl text-gray-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Popular Rooms
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose from our selection of beautifully designed rooms and suites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070",
                title: "Deluxe Suite",
                guests: "2 Guests",
                price: "$450"
              },
              {
                image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
                title: "Executive Room",
                guests: "2 Guests",
                price: "$350"
              },
              {
                image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
                title: "Presidential Suite",
                guests: "4 Guests",
                price: "$850"
              }
            ].map((room, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {room.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <Users size={16} />
                    <span>{room.guests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl text-[#d4af37]">{room.price}</span>
                      <span className="text-gray-500 text-sm ml-1">/night</span>
                    </div>
                    <button className="text-[#d4af37] hover:text-[#c49d2e] text-sm tracking-wider uppercase transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4af37] text-sm tracking-[0.3em] uppercase mb-4">Amenities</p>
            <h3 className="text-5xl text-gray-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              World-Class Facilities
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Wifi, label: "Free WiFi" },
              { icon: Sparkles, label: "Luxury Spa" },
              { icon: Waves, label: "Infinity Pool" },
              { icon: Utensils, label: "Fine Dining" }
            ].map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Icon size={32} className="text-[#d4af37]" />
                  </div>
                  <p className="text-gray-700 tracking-wide">{amenity.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
