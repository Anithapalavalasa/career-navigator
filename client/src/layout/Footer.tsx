import React from 'react';

const NAV_COLS = [
  {
    heading: "Institution",
    links: [
      { label: "About JNTU-GV", href: "https://jntugv.edu.in" },
      { label: "Academic Programs", href: "#" },
      { label: "Administration", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Job Portal", href: "#" },
      { label: "Internships", href: "#" },
      { label: "Campus Events", href: "#" },
    ],
  },
  {
    heading: "Programmes",
    links: [
      { label: "Skill Training", href: "#" },
      { label: "Certifications", href: "#" },
      { label: "Industry Connect", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Grievance Cell", href: "#" },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* ── Top Accent Bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500" />

      {/* ── Brand Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">

        {/* Mobile: stack vertically | md: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">

          {/* ── JNTU-GV ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white p-0.5 overflow-hidden flex-shrink-0">
                <img
                  src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg"
                  alt="JNTU-GV Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">JNTU-GV</p>
                <p className="text-xs text-blue-400 leading-tight">Gurajada Vizianagram</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs md:max-w-none">
              An autonomous university committed to excellence in technical education and research.
            </p>
            <a
              href="https://jntugv.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              jntugv.edu.in ↗
            </a>
          </div>

          {/* ── Careers Cell ── */}
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-lg mb-3">
              🎓
            </div>
            <p className="text-sm font-bold text-white mb-1">Careers &amp; Opportunities Cell</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Bridging academia and industry through career guidance, skill development, and placement support.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded text-xs font-medium">Career Guidance</span>
              <span className="px-2 py-0.5 bg-green-900/60 text-green-300 rounded text-xs font-medium">Placement</span>
              <span className="px-2 py-0.5 bg-amber-900/60 text-amber-300 rounded text-xs font-medium">Skills</span>
            </div>
          </div>

          {/* ── Nirmaan ── */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="flex items-center gap-3 mb-3">
              <div className="md:order-2">
                <p className="text-sm font-bold text-white leading-tight">Nirmaan Organization</p>
                <p className="text-xs text-green-400 leading-tight">Employability Partner</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-green-500 bg-white p-0.5 overflow-hidden flex-shrink-0 flex items-center justify-center md:order-3">
                <img
                  src="https://learn.nirmaanskills.org/images/logo.png"
                  alt="Nirmaan Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs md:max-w-none">
              Advancing employability through industry-relevant training, certifications, and mentorship.
            </p>
            <a
              href="https://learn.nirmaanskills.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
            >
              nirmaanskills.org ↗
            </a>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-700/60" />

      {/* ── Quick Links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile: 2×2 grid | sm+: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-2.5">
                {col.heading}
              </p>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-700/60" />

      {/* ── Bottom Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile: stacked | sm: row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">

          <p className="text-xs text-gray-500 text-center sm:text-left leading-relaxed">
            © 2026 JNTU-GV Careers &amp; Opportunities Cell. All rights reserved.
            <span className="block sm:inline sm:ml-1">
              Developed by{' '}
              <a
                href="https://dmc.jntugv.edu.in"
                className="hover:text-gray-300 transition-colors underline underline-offset-2"
              >
                Digital Monitoring Cell
              </a>.
            </span>
          </p>

          <div className="flex items-center gap-4 flex-shrink-0">
            {['Privacy', 'Terms', 'Accessibility'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
