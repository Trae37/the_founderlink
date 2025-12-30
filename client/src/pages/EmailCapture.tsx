import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailCapture() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store email and name in session storage for later use
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userName", name);

      // Navigate to assessment
      navigate("/assessment");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
            TFL
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Get Your Smart Fit Snapshot
          </h1>
          <p className="text-white/70 text-lg">
            Complete the 5-minute assessment and we'll send your personalized results instantly.
          </p>
        </div>

        {/* Email Capture Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">
                Your Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Johnson"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
              <p className="text-white/50 text-sm mt-2">
                We'll send your results here. You'll also get the Decode newsletter with practical hiring insights.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              {isSubmitting ? "Starting Assessment..." : "Start Your Assessment"}
            </Button>

            <p className="text-white/40 text-xs text-center">
              Free. No spam. Unsubscribe anytime.
            </p>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-white/60 hover:text-white text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
