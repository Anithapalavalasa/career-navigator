import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@/hooks/use-registrations";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { mutate: login, isPending, error } = useAdminLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: () => {
        setLocation("/admin/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden flex-col items-center justify-center p-12 text-white hero-pattern">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          {/* JNTU Logo */}
          <div className="mx-auto w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-6 overflow-hidden">
            <img
              src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg"
              alt="JNTU-GV"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">JNTU-GV</h1>
          <p className="text-blue-300 font-medium mb-1">Careers & Opportunities Cell</p>
          <p className="text-blue-400 text-sm mb-8">Administrative Portal</p>

          <div className="h-px bg-blue-700 w-24 mx-auto mb-8" />

          <div className="space-y-4 text-left">
            {[
              { icon: "📊", title: "Registration Management", desc: "View and manage candidate registrations" },
              { icon: "📥", title: "Data Export", desc: "Download candidate data as Excel reports" },
              { icon: "🔍", title: "Search & Filter", desc: "Find candidates by name, district or qualification" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{f.title}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Login Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {/* Top Brand */}
          <div className="text-center mb-10">
            <div className="mx-auto w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Sign In</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the dashboard</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />
            <form onSubmit={handleLogin} className="p-8 space-y-6">

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {(error as any).message || "Invalid credentials. Please try again."}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            This portal is restricted to authorized administrators only.
            <br />Unauthorized access is strictly prohibited.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
