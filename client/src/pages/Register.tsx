import { RegistrationForm } from "@/components/RegistrationForm";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-white/20">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Secure Application Portal
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <RegistrationForm />
      </motion.div>
    </div>
  );
}
