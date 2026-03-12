import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    review: "An absolutely stunning hotel! The service was impeccable, and the room exceeded all expectations. The attention to detail in every aspect of our stay was remarkable.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    review: "Grand Horizon Hotel redefined luxury for me. From the moment I stepped into the lobby to checkout, everything was perfect. The spa treatments were divine.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    rating: 5,
    review: "A five-star experience in every way. The staff went above and beyond to make our anniversary special. The views from our suite were breathtaking.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[#faf8f5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block w-12 h-[2px] bg-[#c9a961] mb-8"></div>
          <p className="text-[#c9a961] text-sm tracking-[0.3em] uppercase mb-6">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#2d5f4c] mb-6 tracking-tight">
            Guest Experiences
          </h2>
          <p className="text-[#5a5a5a] text-lg max-w-3xl mx-auto leading-relaxed">
            Read about the experiences of our valued guests and discover why they choose to stay with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-10 hover:shadow-2xl transition-all duration-500 group"
            >
              <Quote size={48} className="text-[#c9a961]/20 mb-6" />
              <div className="flex items-center gap-1 mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#c9a961] text-[#c9a961]" />
                ))}
              </div>
              <p className="text-[#5a5a5a] mb-10 leading-[1.8] text-lg">
                {testimonial.review}
              </p>
              <div className="flex items-center gap-5 pt-8 border-t border-[#e5d5b7]">
                <ImageWithFallback
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#c9a961]"
                />
                <div>
                  <h4 className="text-[#2d5f4c] text-lg mb-1">{testimonial.name}</h4>
                  <p className="text-[#5a5a5a] text-sm tracking-wider">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=150&background=c9a961&color=fff`;
      }}
    />
  );
}
