import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-black/95 backdrop-blur-xl py-4" : "bg-transparent py-8"
    }`}>
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between">
          <a href="#home" className="flex flex-col group">
            <span className="text-3xl tracking-[0.15em] text-[#d4af37] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Grand Horizon
            </span>
            <span className="text-[10px] tracking-[0.4em] text-white/60 uppercase mt-1 ml-1">Luxury Hotel</span>
          </a>

          <div className="hidden lg:flex items-center space-x-12">
            <a href="#home" className="text-xs text-white/80 hover:text-[#d4af37] transition-all duration-300 tracking-[0.2em] uppercase relative group">
              Home
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#rooms" className="text-xs text-white/80 hover:text-[#d4af37] transition-all duration-300 tracking-[0.2em] uppercase relative group">
              Rooms
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#amenities" className="text-xs text-white/80 hover:text-[#d4af37] transition-all duration-300 tracking-[0.2em] uppercase relative group">
              Amenities
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#gallery" className="text-xs text-white/80 hover:text-[#d4af37] transition-all duration-300 tracking-[0.2em] uppercase relative group">
              Gallery
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-xs text-white/80 hover:text-[#d4af37] transition-all duration-300 tracking-[0.2em] uppercase relative group">
              Contact
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </a>
            <button className="border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-10 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300">
              Book Now
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#d4af37] transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-xl border-t border-[#d4af37]/20 mt-6">
          <div className="px-8 pt-8 pb-10 space-y-8">
            <a
              href="#home"
              className="block text-xs tracking-[0.25em] text-white/80 hover:text-[#d4af37] py-2 uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#rooms"
              className="block text-xs tracking-[0.25em] text-white/80 hover:text-[#d4af37] py-2 uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </a>
            <a
              href="#amenities"
              className="block text-xs tracking-[0.25em] text-white/80 hover:text-[#d4af37] py-2 uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Amenities
            </a>
            <a
              href="#gallery"
              className="block text-xs tracking-[0.25em] text-white/80 hover:text-[#d4af37] py-2 uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </a>
            <a
              href="#contact"
              className="block text-xs tracking-[0.25em] text-white/80 hover:text-[#d4af37] py-2 uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <button className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-10 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 mt-4">
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
