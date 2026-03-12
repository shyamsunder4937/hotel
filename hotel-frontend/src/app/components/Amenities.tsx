import { Wifi, Waves, Sparkles, UtensilsCrossed, Dumbbell, ParkingCircle } from "lucide-react";

const amenities = [
  {
    id: 1,
    icon: Wifi,
    title: "Free WiFi",
    description: "High-speed internet throughout the property"
  },
  {
    id: 2,
    icon: Waves,
    title: "Swimming Pool",
    description: "Infinity pool with stunning city views"
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Luxury Spa",
    description: "Full-service spa with premium treatments"
  },
  {
    id: 4,
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "Award-winning restaurant and bar"
  },
  {
    id: 5,
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art gym equipment 24/7"
  },
  {
    id: 6,
    icon: ParkingCircle,
    title: "Valet Parking",
    description: "Complimentary parking for all guests"
  }
];

export function Amenities() {
  return (
    <section id="amenities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-[#f5efe3] text-[#c9a961] rounded-full mb-6">
            Facilities
          </div>
          <h2 className="text-4xl md:text-5xl text-[#1a5f3c] mb-4">
            World-Class Amenities
          </h2>
          <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
            Experience exceptional facilities designed to enhance your stay and provide ultimate comfort and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div
                key={amenity.id}
                className="bg-[#fdfbf7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c9a961]/10 rounded-full mb-6">
                  <Icon size={32} className="text-[#c9a961]" />
                </div>
                <h3 className="text-xl text-[#1a5f3c] mb-3">{amenity.title}</h3>
                <p className="text-[#6b6b6b]">{amenity.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
