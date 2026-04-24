import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block text-4xl font-black tracking-tighter uppercase mb-6 hover:text-primary transition-colors">
              GSV
            </Link>
            <p className="text-white/60 max-w-md text-sm md:text-base leading-relaxed font-medium">
              The Bay Area's premier independent sports media outlet. 
              Gritty, photo-first coverage of high school, college, and grassroots sports.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] md:text-xs mb-6 text-white/40">Coverage</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
              <li><Link href="/high-school" className="hover:text-primary transition-colors">High School</Link></li>
              <li><Link href="/college" className="hover:text-primary transition-colors">College</Link></li>
              <li><Link href="/club" className="hover:text-primary transition-colors">Club</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] md:text-xs mb-6 text-white/40">Connect</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
              <li><Link href="/galleries" className="hover:text-primary transition-colors">Photo Galleries</Link></li>
              <li><Link href="/spotlights" className="hover:text-primary transition-colors">Athlete Spotlights</Link></li>
              <li><Link href="/posts" className="hover:text-primary transition-colors">Live Updates</Link></li>
              <li className="pt-4">
                <Link href="/login" className="text-white/30 hover:text-primary transition-colors text-[10px] inline-block mt-4 border border-white/10 px-3 py-1.5">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
          <p>&copy; {new Date().getFullYear()} Golden State Visuals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
