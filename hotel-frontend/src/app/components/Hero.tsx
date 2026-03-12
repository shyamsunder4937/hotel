import { Calendar, Users, Home } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="relative h-screen pt-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758194090785-8e09b7288199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxNXx8bHV4dXJ5JTIwaG90ZWwlMjBsb2JieSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjkwMjY0OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Grand Horizon Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
            Experience Luxury & Comfort
          </h1>
          <p className="text-white/95 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Stay in the heart of the city with world-class hospitality
          </p>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="text-[#4a4a4a] text-sm mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-[#c9a961]" />
                  Check-in
                </label>
                <input
                  type="date"
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[#4a4a4a] text-sm mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-[#c9a961]" />
                  Check-out
                </label>
                <input
                  type="date"
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[#4a4a4a] text-sm mb-2 flex items-center gap-2">
                  <Users size={18} className="text-[#c9a961]" />
                  Guests
                </label>
                <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] bg-white">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[#4a4a4a] text-sm mb-2 flex items-center gap-2">
                  <Home size={18} className="text-[#c9a961]" />
                  Room Type
                </label>
                <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] bg-white">
                  <option>Deluxe Room</option>
                  <option>Executive Suite</option>
                  <option>Presidential Suite</option>
                  <option>Royal Suite</option>
                </select>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#c9a961] hover:bg-[#b89850] text-white py-4 rounded-lg transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
