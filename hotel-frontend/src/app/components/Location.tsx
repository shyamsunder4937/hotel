import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Location() {
  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block w-12 h-[2px] bg-[#c9a961] mb-8"></div>
          <p className="text-[#c9a961] text-sm tracking-[0.3em] uppercase mb-6">
            Location
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#2d5f4c] mb-6 tracking-tight">
            Visit Us
          </h2>
          <p className="text-[#5a5a5a] text-lg max-w-3xl mx-auto leading-relaxed">
            Perfectly located in the heart of the city, we're easily accessible and surrounded by the best attractions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="flex gap-8 group">
              <div className="flex-shrink-0 w-16 h-16 border-2 border-[#c9a961] group-hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300">
                <MapPin className="text-[#c9a961] group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <div>
                <h3 className="text-xl text-[#2d5f4c] mb-3 tracking-wide">Address</h3>
                <p className="text-[#5a5a5a] leading-[1.8] text-lg">
                  123 Grand Avenue, Downtown District<br />
                  Metropolitan City, MC 10001<br />
                  United States
                </p>
              </div>
            </div>

            <div className="flex gap-8 group">
              <div className="flex-shrink-0 w-16 h-16 border-2 border-[#c9a961] group-hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300">
                <Phone className="text-[#c9a961] group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <div>
                <h3 className="text-xl text-[#2d5f4c] mb-3 tracking-wide">Phone</h3>
                <p className="text-[#5a5a5a] leading-[1.8] text-lg">
                  +1 (555) 123-4567<br />
                  +1 (555) 123-4568
                </p>
              </div>
            </div>

            <div className="flex gap-8 group">
              <div className="flex-shrink-0 w-16 h-16 border-2 border-[#c9a961] group-hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300">
                <Mail className="text-[#c9a961] group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <div>
                <h3 className="text-xl text-[#2d5f4c] mb-3 tracking-wide">Email</h3>
                <p className="text-[#5a5a5a] leading-[1.8] text-lg">
                  reservations@grandhorizon.com<br />
                  info@grandhorizon.com
                </p>
              </div>
            </div>

            <div className="bg-[#faf8f5] p-10 mt-12">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="text-[#c9a961]" size={32} />
                <h3 className="text-2xl text-[#2d5f4c] tracking-wide">Working Hours</h3>
              </div>
              <div className="space-y-4 text-[#5a5a5a] text-lg">
                <div className="flex justify-between pb-4 border-b border-[#e5d5b7]">
                  <span>Front Desk</span>
                  <span className="text-[#c9a961]">24/7</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-[#e5d5b7]">
                  <span>Check-in</span>
                  <span className="text-[#c9a961]">3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="text-[#c9a961]">12:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[700px] overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98731668459395!3d40.75889797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Grand Horizon Hotel Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
