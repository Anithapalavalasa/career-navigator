import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronRight,
  FileText,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "wouter";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const FEATURES = [
  {
    icon: <UserPlus className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-700",
    accent: "border-l-4 border-blue-500",
    title: "Easy Registration",
    description:
      "Simple, guided step-by-step process to submit your profile and academic credentials into the system seamlessly.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-indigo-100 text-indigo-700",
    accent: "border-l-4 border-indigo-500",
    title: "Skill Verification",
    description:
      "Upload certificates and get your qualifications verified by our expert academic and industry committee.",
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-amber-100 text-amber-700",
    accent: "border-l-4 border-amber-500",
    title: "Job Placement",
    description:
      "Get matched with top employers and industry partners based on your qualifications and preferred locations.",
  },
];

const STEPS = [
  { step: "01", title: "Create Profile", desc: "Fill out the registration form with your personal and academic details." },
  { step: "02", title: "Upload Documents", desc: "Attach your certificates, mark sheets, and other relevant credentials." },
  { step: "03", title: "Verification", desc: "Our team reviews and verifies your submitted information." },
  { step: "04", title: "Get Placed", desc: "Receive placement opportunities matching your profile and preferences." },
];

const STATS = [
  { value: "500+", label: "Students Registered", icon: <Users className="h-5 w-5" /> },
  { value: "70+", label: "Industry Partners", icon: <Building2 className="h-5 w-5" /> },
  { value: "60%", label: "Placement Rate", icon: <Award className="h-5 w-5" /> },
  { value: "4", label: "Districts Covered", icon: <BookOpen className="h-5 w-5" /> },
];

export default function Home() {
  return (
    <div className="w-full">

      {/* ══════════════════════════════════
          HERO
          ══════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1a3a8f 50%, #1e4db7 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
          {/* Dot grid overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div variants={item} className="mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                style={{ background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.35)", color: "#fde68a" }}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                Applications Open — Academic Year 2025–26
              </span>
            </motion.div>

            {/* Headline — explicitly white, no opacity tricks */}
            <motion.h1
              variants={item}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#ffffff" }}
            >
              Launch Your Career
              <span className="block mt-1" style={{ color: "#fbbf24" }}>with JNTU-GV</span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              variants={item}
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
              style={{ color: "#bfdbfe" }}
            >
              The Careers &amp; Opportunities Cell connects JNTU-GV graduates with top employers and
              industry partners through a structured placement program in collaboration with{" "}
              <strong style={{ color: "#ffffff" }}>Nirmaan Organization</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 px-7 text-sm font-bold rounded-lg shadow-lg transition-all duration-200"
                  style={{ background: "#f59e0b", color: "#fff", border: "none" }}
                >
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-7 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", background: "rgba(255,255,255,0.1)" }}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Admin Access
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS STRIP
          ══════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center justify-center py-6 px-3 text-center"
              >
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-2">
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-0.5">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES
          ══════════════════════════════════ */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Why Register?</span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-gray-900">Your Complete Career Launchpad</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
              End-to-end support from skill verification to final placement — ensuring every graduate finds the right opportunity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-xl p-6 sm:p-8 ${f.accent} shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.description}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════ */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Process</span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
              Our transparent, four-step process ensures a smooth journey from registration to placement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="absolute top-8 left-0 right-0 hidden lg:block">
              <div className="mx-auto h-0.5 bg-blue-100"
                style={{ width: "calc(100% - 8rem)", marginLeft: "4rem" }} />
            </div>
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center mb-4 z-10 shadow-md">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
          ══════════════════════════════════ */}
      <section className="py-14 sm:py-16" style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1e4db7 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-6 sm:flex-row sm:text-left sm:justify-between"
          >
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
                Ready to begin your career journey?
              </h2>
              <p className="text-sm sm:text-base" style={{ color: "#bfdbfe" }}>
                Register now and take the first step towards your professional future with JNTU-GV.
              </p>
            </div>
            <Link href="/register" className="flex-shrink-0">
              <Button
                size="lg"
                className="h-11 px-8 font-bold rounded-lg shadow-lg transition-all duration-200"
                style={{ background: "#f59e0b", color: "#fff", border: "none" }}
              >
                <FileText className="mr-2 h-4 w-4" /> Start Registration
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          ELIGIBILITY
          ══════════════════════════════════ */}
      <section className="bg-gray-50 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Eligibility</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 mb-5">Who Can Register?</h2>
              <div className="space-y-3">
                {[
                  "Graduates from JNTU-GV affiliated colleges",
                  "Students from Andhra Pradesh districts",
                  "Candidates with B.Tech, Diploma, ITI, B.Sc, B.Com and other qualifications",
                  "Freshers and experienced candidates seeking placement support",
                  "Students with or without certifications are welcome",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-6 sm:p-8 text-white"
              style={{ background: "linear-gradient(135deg, #1a3a8f, #1e4db7)" }}
            >
              <h3 className="text-lg font-bold mb-5" style={{ color: "#fcd34d" }}>Documents Required</h3>
              <div className="space-y-4">
                {[
                  { title: "Academic Certificates", desc: "Degree/Diploma pass certificates and mark sheets" },
                  { title: "Skill Certificates", desc: "Any technical or soft-skill certifications earned" },
                  { title: "Identity Proof", desc: "Aadhaar card or government-issued photo ID" },
                  { title: "Contact Details", desc: "Active email address and mobile number" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-blue-700/50 pb-3 last:border-0 last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#dbeafe" }}>{doc.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>{doc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
