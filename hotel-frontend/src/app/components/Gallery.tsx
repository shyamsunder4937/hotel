import { ImageWithFallback } from "./figma/ImageWithFallback";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1723465302725-ff46b3e165f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyOTAyNjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Elegant Dining Room"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1723465313715-586dd9689b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyOTAyNjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Luxury Lounge"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1758714919725-d2740fc99f14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyOTAyNjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Grand Entrance"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1771206331424-44b8ec9acdf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyOTAyNjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Modern Lounge Area"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1744000311635-0280df5cc00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Luxury Suite Living Room"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1765434670017-c0d28ecde29a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb20lMjBzdWl0ZXxlbnwxfHx8fDE3NzI5MDI2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Modern Bedroom"
  }
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-[#f5efe3] text-[#c9a961] rounded-full mb-6">
            Gallery
          </div>
          <h2 className="text-4xl md:text-5xl text-[#1a5f3c] mb-4">
            Explore Our Hotel
          </h2>
          <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
            Take a visual journey through our stunning spaces and discover what makes Grand Horizon Hotel truly exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
