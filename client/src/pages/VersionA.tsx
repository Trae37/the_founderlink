import { useState } from "react";

export default function VersionA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
      console.log("Email submitted:", email);
      setTimeout(() => {
        setSubmitted(true);
        setEmail("");
        setIsLoading(false);
        setTimeout(() => setSubmitted(false), 4000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950 text-lg tracking-tight">THE FOUNDER LINK</span>
          </div>
          <span className="text-xs text-gray-500">Version A</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION - Desktop: Full-Bleed Background, Mobile: Stacked Layout */}
        <section className="relative">
          {/* Desktop Hero - Full-bleed background */}
          <div
            className="hidden md:flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: "url('/hero-composite.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              height: "100vh",
              width: "100%",
            }}
          >
            {/* Light Gradient Overlay - Only on left side for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 max-w-6xl text-left">
              <div className="max-w-2xl">
                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-950 mb-6 leading-tight">
                  Bad Developer Hires Are Killing Your Startup. Here's How to Stop It.
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl font-semibold text-slate-700 mb-10 leading-relaxed">
                  Find and hire great developers in 7 days. Plus, get your Smart Fit Snapshot within 24 hours so you know which devs you need. No tech background needed.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-lg">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="px-5 py-4 rounded-lg border-2 border-gray-300 bg-white text-slate-950 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 flex-1 sm:flex-none transition"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 whitespace-nowrap shadow-lg shadow-pink-500/30 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Get The Smart Selection Sprint"}
                  </button>
                </form>

                {submitted && (
                  <div className="text-sm text-pink-600 font-medium mb-6">
                    Check your inbox! The Smart Selection Sprint is on its way.
                  </div>
                )}

                <p className="text-sm text-slate-600">
                  No spam. No credit card. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Hero - Stacked Layout with Image as Element */}
          <div className="md:hidden bg-white py-12 px-6">
            <div className="container mx-auto max-w-2xl">
              {/* Hero Image */}
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/hero-composite.jpg"
                  alt="Developer hiring transformation"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Content */}
              <div>
                {/* Headline */}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4 leading-tight">
                  Bad Developer Hires Are Killing Your Startup. Here's How to Stop It.
                </h1>

                {/* Subheadline */}
                <p className="text-base md:text-lg font-semibold text-slate-700 mb-8 leading-relaxed">
                  Find and hire great developers in 7 days. Plus, get your Smart Fit Snapshot within 24 hours so you know which devs you need. No tech background needed.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="px-5 py-4 rounded-lg border-2 border-gray-300 bg-white text-slate-950 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg shadow-pink-500/30 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Get The Smart Selection Sprint"}
                  </button>
                </form>

                {submitted && (
                  <div className="text-sm text-pink-600 font-medium mb-6">
                    Check your inbox! The Smart Selection Sprint is on its way.
                  </div>
                )}

                <p className="text-sm text-slate-600">
                  No spam. No credit card. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">
                Get Your Smart Fit Snapshot
              </h2>
              <p className="text-lg text-slate-700">
                Answer 23 quick questions and get a personalized report showing exactly which developers you need to hire.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a href="/assessment" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-5 rounded-lg text-lg transition-all duration-200 shadow-lg shadow-pink-500/30">
                Start Your Smart Fit Assessment
              </a>
              <p className="text-sm text-slate-600 mt-4">
                Takes about 5 minutes. Results delivered instantly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 max-w-6xl text-center text-slate-600 text-sm">
          <p>The Founder Link. Your bridge to world-class technical talent.</p>
        </div>
      </footer>
    </div>
  );
}
