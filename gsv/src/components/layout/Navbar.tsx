import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/high-school", label: "High School" },
  { href: "/college", label: "College" },
  { href: "/club", label: "Club" },
  { href: "/events", label: "Events" },
  { href: "/spotlights", label: "Athlete Spotlights" },
  { href: "/galleries", label: "Galleries" },
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-border py-2"
          : "bg-black text-white border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
              GSV
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-wide transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : scrolled ? "text-foreground" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle via Sheet */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-current hover:text-primary transition-colors focus:outline-none">
                  <Menu size={24} />
                  <span className="sr-only">Toggle Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-white/10 w-[300px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="p-6 border-b border-white/10">
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    GSV
                  </span>
                </div>
                <div className="flex flex-col py-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-bold uppercase tracking-wide transition-colors hover:text-primary px-6 py-3",
                        location === link.href ? "text-primary bg-white/5" : "text-white/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-4 border-t border-white/10" />
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-sm font-bold uppercase tracking-wide text-white/50 hover:text-primary transition-colors px-6 py-3"
                  >
                    Staff Login
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
