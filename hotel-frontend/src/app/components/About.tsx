import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyOTAyNjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Grand Horizon Hotel Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-block px-4 py-1 bg-[#f5efe3] text-[#c9a961] rounded-full mb-6">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl text-[#1a5f3c] mb-6">
              Welcome to Grand Horizon Hotel
            </h2>
            <p className="text-[#6b6b6b] text-lg mb-6 leading-relaxed">
              Nestled in the heart of the city, Grand Horizon Hotel offers an unparalleled experience of luxury and comfort. Our hotel combines timeless elegance with modern sophistication, creating a sanctuary for discerning travelers.
            </p>
            <p className="text-[#6b6b6b] text-lg mb-8 leading-relaxed">
              With breathtaking views, world-class amenities, and exceptional service, we ensure every moment of your stay is memorable. Whether you're here for business or leisure, our dedicated team is committed to exceeding your expectations.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-3xl text-[#c9a961] mb-2">150+</h3>
                <p className="text-[#6b6b6b]">Luxury Rooms</p>
              </div>
              <div>
                <h3 className="text-3xl text-[#c9a961] mb-2">25+</h3>
                <p className="text-[#6b6b6b]">Years Experience</p>
              </div>
              <div>
                <h3 className="text-3xl text-[#c9a961] mb-2">50K+</h3>
                <p className="text-[#6b6b6b]">Happy Guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
