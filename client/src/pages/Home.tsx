import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, ShieldCheck, GraduationCap, Briefcase } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl w-full mx-auto space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <motion.h1 
            variants={item}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            <span className="text-gradient">Career</span> Gateway
          </motion.h1>
          <motion.p 
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Your future starts here. Join our comprehensive career development program and unlock your potential.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50">
                Admin Access
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={item} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <UserPlus className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Easy Registration</h3>
            <p className="text-muted-foreground">Simple and streamlined process to get your profile into our system quickly.</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Skill Verification</h3>
            <p className="text-muted-foreground">Upload your certificates and get your skills verified by our expert team.</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-600">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Job Placement</h3>
            <p className="text-muted-foreground">Get matched with top employers based on your qualifications and preferences.</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-center text-muted-foreground text-sm"
      >
        © 2024 Career Gateway System. All rights reserved.
      </motion.footer>
    </div>
  );
}
