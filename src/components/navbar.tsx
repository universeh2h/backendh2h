import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {  Menu, X } from "lucide-react";
import { dataHeader } from "@/data/dataHeader";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="w-full px-4 py-3 backdrop-blur-sm sticky top-0 bg-neutral-300 flex justify-center left-0 z-40 ">
      <div className="max-w-7xl w-full flex justify-between">
      {/* Logo */}
      <a href="/" className="text-lg  text-center">
        {"PRODUKSI HITS"}
      </a>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 font-bebas">
        {dataHeader.map((item) => (
            <a href={item.href} key={item.href}>
            <p className="hover:text-gray-400 transition-colors">{item.label}</p>
          </a>
        ))}
      </div>

      {/* Profile + Menu Button */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            size="icon"
            className="bg-transparent size-8 text-white"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar