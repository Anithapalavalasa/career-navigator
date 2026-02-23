import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft, Info } from "lucide-react";
import { Link } from "wouter";

const INSTRUCTIONS = [
  "Fill all mandatory fields marked with *",
  "Ensure your email address is active and accessible",
  "Date of Birth must be accurate — age is auto-calculated",
  "Provide complete and honest certification details",
  "Submit only once; duplicate entries will be rejected",
];

export default function Register() {
  return (
    <div className="w-full bg-gray-50 min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
              <Link href="/">
                <span className="hover:text-blue-700 cursor-pointer transition-colors">Home</span>
              </Link>
              <ChevronLeft className="h-3 w-3 rotate-180 text-gray-400" />
              <span className="text-blue-700 font-semibold">Registration</span>
            </nav>
            <Link href="/">
              <Button variant="ghost" size="sm"
                className="h-7 text-xs text-gray-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                <ChevronLeft className="mr-1 h-3 w-3" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* ── Blue Page Header ── */}
      {/* <div className="py-5 sm:py-8" style={{ background: "linear-gradient(135deg, #1a3a8f, #1e4db7)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#93c5fd" }}>
              Careers &amp; Opportunities Cell
            </p>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "#ffffff" }}>
              Candidate Registration Form
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "#bfdbfe" }}>
              Register your profile for JNTU-GV placement opportunities via Nirmaan Organization.
            </p>
          </motion.div>
        </div>
      </div> */}

      {/* ── Content: Sidebar + Form ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">

          {/* ── Sidebar (shows above form on mobile) ── */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-1 flex flex-col gap-4"
          >
            {/* Instructions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-700 px-4 py-2.5 flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-blue-200" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wide">Instructions</h2>
              </div>
              {/* On mobile show as horizontal wrap, on desktop as vertical list */}
              <div className="p-3.5">
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:space-y-2">
                  {INSTRUCTIONS.map((inst, i) => (
                    <div key={i} className="flex items-start gap-1.5 lg:w-full">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-snug">{inst}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help — hidden on mobile to save space */}
            <div className="hidden sm:block bg-amber-50 rounded-xl border border-amber-200 p-3.5">
              <h3 className="text-xs font-bold text-amber-800 mb-1.5">Need Help?</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Contact the Careers Cell (Mon–Fri, 9:00 AM – 5:00 PM).
              </p>
              <div className="mt-1.5 text-xs text-amber-800 font-semibold">
                📧 careers.opportunities@jntugv.edu.in
              </div>
            </div>

            {/* Section Overview — desktop only */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm p-3.5">
              <h3 className="text-xs font-bold text-gray-800 mb-2.5">Section Overview</h3>
              <div className="space-y-2">
                {[
                  { label: "Personal Information", fields: "Name, DOB, Gender, Category" },
                  { label: "Contact Details", fields: "Email, Phone" },
                  { label: "Academic Details", fields: "Qualification, Year, Status" },
                  { label: "Location Preferences", fields: "District, Preferred City" },
                  { label: "Certifications", fields: "Certificates (if any)" },
                ].map((sec, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{sec.label}</p>
                      <p className="text-xs text-gray-400">{sec.fields}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* ── Registration Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <RegistrationForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
