import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        {/* Code */}
        <p className="text-7xl font-bold text-blue-900 mb-4">404</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
          Please check the URL or return to the home page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white px-6">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400">
          JNTU-GV Careers &amp; Opportunities Cell Portal
        </p>
      </div>
    </div>
  );
}
