import React, { useEffect, useState } from 'react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''
        }`}
    >
      {/* ── Top Accent Bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-600 to-amber-500" />

      {/* ── Institution Row ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">

            {/* Left: JNTU-GV logo + name */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-800 shadow-sm bg-white">
                  <img
                    src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg"
                    alt="JNTU-GV Logo"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
              </div>
              <div className="min-w-0">
                {/* Abbreviated on mobile, full on sm+ */}
                <p className="block sm:hidden text-sm font-bold text-blue-900 leading-tight">JNTU-GV</p>
                <p className="hidden sm:block text-sm lg:text-base font-bold text-blue-900 leading-tight truncate">
                  Jawaharlal Nehru Technological University
                </p>
                <p className="text-xs text-blue-700 font-medium leading-tight">
                  <span className="sm:hidden">Gurajada Vizianagram</span>
                  <span className="hidden sm:inline">Gurajada Vizianagram (JNTU-GV)</span>
                </p>
                <p className="text-xs text-gray-400 hidden lg:block">An Autonomous University · Est. 2023</p>
              </div>
            </div>

            {/* Center: "In Association With" — only on lg+ */}
            <div className="hidden lg:flex flex-col items-center text-center px-4 border-x border-gray-200 flex-shrink-0">
              <div className="text-xl mb-0.5">🎓</div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">In Association With</p>
            </div>

            {/* Right: Nirmaan logo + name */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-end">
              <div className="min-w-0 text-right">
                <p className="block sm:hidden text-sm font-bold text-green-800 leading-tight">Nirmaan</p>
                <p className="hidden sm:block text-sm lg:text-base font-bold text-green-800 leading-tight">Nirmaan Organization</p>
                <p className="text-xs text-green-600 font-medium leading-tight hidden sm:block">Skills &amp; Employability Partner</p>
                <p className="text-xs text-gray-400 hidden lg:block">nirmaanskills.org</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-green-700 shadow-sm bg-white flex items-center justify-center">
                  <img
                    src="https://learn.nirmaanskills.org/images/logo.png"
                    alt="Nirmaan Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Program Title Bar ── */}
      <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-1.5 sm:py-2">
            <h2 className="text-xs sm:text-sm font-bold text-white text-center tracking-wide">
              {/* Short label on mobile */}
              <span className="sm:hidden">Career Navigator Portal</span>
              <span className="hidden sm:inline">Careers and Opportunities Cell — Career Navigator Portal</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── Tagline Strip — hidden on mobile ── */}
      <div className="bg-amber-50 border-b border-amber-200 hidden sm:block">
        <p className="py-1 text-center text-xs text-amber-800 font-medium px-4">
          ✦ Empowering Students &nbsp;·&nbsp; Building Futures &nbsp;·&nbsp; Creating Opportunities &nbsp;·&nbsp; Your Gateway to Professional Excellence ✦
        </p>
      </div>
    </header>
  );
};

export default Header;
