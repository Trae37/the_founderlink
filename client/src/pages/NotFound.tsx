import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#F3F2EE] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl font-mono font-bold text-neutral-300 mb-4">404</div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Page Not Found</h1>
          <p className="text-neutral-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="mt-12 text-sm text-neutral-500">
          Need help?{" "}
          <a
            href="mailto:support@thefounderlink.com"
            className="text-blue-600 hover:underline"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
