import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer id="dining" className="bg-[#1d2d27] text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div>
            <div className="flex flex-col mb-8">
              <span className="text-2xl tracking-[0.3em] text-white uppercase">Grand</span>
              <span className="text-xs tracking-[0.5em] text-[#c9a961] uppercase -mt-1">Horizon</span>
            </div>
            <p className="text-white/70 mb-8 leading-[1.8]">
              Experience the epitome of luxury and comfort in the heart of the city.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 border-2 border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook size={18} className="text-[#c9a961] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 border-2 border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram size={18} className="text-[#c9a961] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 border-2 border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300 group"
              >
                <Twitter size={18} className="text-[#c9a961] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 border-2 border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin size={18} className="text-[#c9a961] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg mb-8 text-[#c9a961] tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="#home" className="text-white/70 hover:text-[#c9a961] transition-colors text-lg">
                  Home
                </a>
              </li>
              <li>
                <a href="#rooms" className="text-white/70 hover:text-[#c9a961] transition-colors text-lg">
                  Rooms & Suites
                </a>
              </li>
              <li>
                <a href="#amenities" className="text-white/70 hover:text-[#c9a961] transition-colors text-lg">
                  Amenities
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-white/70 hover:text-[#c9a961] transition-colors text-lg">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-[#c9a961] transition-colors text-lg">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-8 text-[#c9a961] tracking-widest uppercase">Services</h4>
            <ul className="space-y-4 text-white/70 text-lg">
              <li>Restaurant & Bar</li>
              <li>Spa & Wellness</li>
              <li>Conference Rooms</li>
              <li>Wedding Events</li>
              <li>Concierge Service</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-8 text-[#c9a961] tracking-widest uppercase">Newsletter</h4>
            <p className="text-white/70 mb-6 leading-[1.8] text-lg">
              Subscribe to receive exclusive offers and updates.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 focus:border-[#c9a961] text-white placeholder:text-white/40 focus:outline-none transition-all duration-300"
              />
              <button className="w-full bg-[#c9a961] hover:bg-white text-white hover:text-[#2d5f4c] py-4 transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase group">
                Subscribe
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/50 text-sm tracking-wider">
              © 2026 Grand Horizon Hotel. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-white/50 hover:text-[#c9a961] transition-colors tracking-wider">
                Privacy Policy
              </a>
              <a href="#" className="text-white/50 hover:text-[#c9a961] transition-colors tracking-wider">
                Terms of Service
              </a>
              <a href="#" className="text-white/50 hover:text-[#c9a961] transition-colors tracking-wider">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
