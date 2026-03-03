import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin, useForgotPassword, useResetPassword } from "@/hooks/use-registrations";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type View = "login" | "forgot-password" | "reset-password" | "success";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("login");
  const [resetToken, setResetToken] = useState(new URLSearchParams(window.location.search).get("token") || "");
  
  const [, setLocation] = useLocation();
  const { mutate: login, isPending: isLoggingIn, error: loginError } = useAdminLogin();
  const { mutate: forgotPassword, isPending: isSendingReset } = useForgotPassword();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    login({ username, password }, {
      onSuccess: (data: { role: string; username: string }) => {
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminUsername", data.username);
        setLocation("/admin/dashboard");
      },
      onError: () => {
        setFormError("Invalid username or password");
      }
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!email.trim()) {
      setFormError("Please enter your email address");
      return;
    }
    forgotPassword(email, {
      onSuccess: () => {
        setSuccessMessage("If an account with that email exists, a password reset link has been sent.");
        setView("success");
      },
      onError: (err: Error) => {
        setFormError(err.message);
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!resetToken) {
      setFormError("Invalid reset token");
      return;
    }
    
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    
    resetPassword({ token: resetToken, newPassword }, {
      onSuccess: () => {
        setView("success");
        setSuccessMessage("Password reset successful! You can now log in with your new password.");
      },
      onError: (err: Error) => {
        setFormError(err.message);
      }
    });
  };

  const renderLoginForm = () => (
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
          <button 
            type="button"
            onClick={() => { setView("forgot-password"); setFormError(""); }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-transparent border-none cursor-pointer"
          >
            Forgot password?
          </button>
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

      {(formError || loginError) && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError || (loginError as Error)?.message || "Invalid credentials. Please try again."}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
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
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="p-8 space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-700" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      {formError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => { setView("login"); setFormError(""); }}
          className="flex-1 h-11"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
          disabled={isSendingReset}
        >
          {isSendingReset ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </div>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="p-8 space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-blue-700" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Create New Password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your new password below.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
        />
        <p className="text-xs text-gray-500">Must be at least 8 characters</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {formError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => { setView("login"); setFormError(""); }}
          className="flex-1 h-11"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
          disabled={isResetting}
        >
          {isResetting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </form>
  );

  const renderSuccessView = () => (
    <div className="p-8 space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Check Your Email</h2>
        <p className="text-sm text-gray-500 mt-2">
          {successMessage}
        </p>
      </div>

      <Button
        onClick={() => { setView("login"); setSuccessMessage(""); }}
        className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Login
      </Button>
    </div>
  );

  // Determine which form to show based on URL token
  useEffect(() => {
    if (resetToken && view === "login") {
      setView("reset-password");
    }
  }, [resetToken, view]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
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
              { icon: "🔒", title: "Secure Access", desc: "Protected by role-based authentication" },
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

      {/* Right Panel */}
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
            <h1 className="text-2xl font-bold text-gray-900">
              {view === "login" && "Admin Sign In"}
              {view === "forgot-password" && "Forgot Password"}
              {view === "reset-password" && "Reset Password"}
              {view === "success" && "Success"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {view === "login" && "Enter your credentials to access the dashboard"}
              {view === "forgot-password" && "We'll help you recover your account"}
              {view === "reset-password" && "Create a new secure password"}
              {view === "success" && "Operation completed"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />
            {view === "login" && renderLoginForm()}
            {view === "forgot-password" && renderForgotPasswordForm()}
            {view === "reset-password" && renderResetPasswordForm()}
            {view === "success" && renderSuccessView()}
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
