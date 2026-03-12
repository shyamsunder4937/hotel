import { ImageWithFallback } from "./figma/ImageWithFallback";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    price: 299,
    description: "Elegant room with city views, king bed, and modern amenities for a comfortable stay.",
    image: "https://images.unsplash.com/photo-1612645213559-6af1d4edeaf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Executive Suite",
    price: 499,
    description: "Spacious suite with separate living area, premium furnishings, and panoramic views.",
    image: "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Presidential Suite",
    price: 899,
    description: "Ultimate luxury with private terrace, Jacuzzi, dining area, and personalized butler service.",
    image: "https://images.unsplash.com/photo-1744000311897-510b64f9a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Royal Suite",
    price: 1299,
    description: "The pinnacle of opulence featuring multiple bedrooms, grand living spaces, and exclusive amenities.",
    image: "https://images.unsplash.com/photo-1759223198981-661cadbbff36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function Rooms() {
  return (
    <section id="rooms" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-[#f5efe3] text-[#c9a961] rounded-full mb-6">
            Accommodations
          </div>
          <h2 className="text-4xl md:text-5xl text-[#1a5f3c] mb-4">
            Rooms & Suites
          </h2>
          <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
            Discover our collection of exquisitely designed rooms and suites, each offering a unique blend of comfort and sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl text-[#1a5f3c]">{room.name}</h3>
                  <div className="text-right">
                    <p className="text-[#c9a961] text-3xl">${room.price}</p>
                    <p className="text-[#6b6b6b] text-sm">per night</p>
                  </div>
                </div>
                <p className="text-[#6b6b6b] mb-6 leading-relaxed">
                  {room.description}
                </p>
                <button className="w-full bg-[#1a5f3c] hover:bg-[#145031] text-white py-3 rounded-lg transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
