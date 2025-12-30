import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HeroVariation3() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
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
      <nav className="sticky top-0 z-50 bg-[#0D1B2A]/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <span className="font-bold text-white text-lg tracking-tight">THE FOUNDER LINK</span>
          <span className="text-xs text-slate-400">Variation 3: Side-Positioned Image</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION - Two Column Layout */}
        <section className="bg-gradient-to-b from-[#0D1B2A] to-[#0D1B2A] py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* LEFT: Text Content */}
              <div className="max-w-xl">
                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Bad Developer Hires Are Killing Your Startup. Here's How to Stop It.
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed">
                  Find, vet, and hire the right developers in 7 days. No tech background needed.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 max-w-lg">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="px-5 py-4 rounded-lg border-2 border-[#00D9FF] bg-white text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]/50 transition"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#FF5744] hover:bg-[#E64A35] text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg shadow-[#FF5744]/40"
                  >
                    {isLoading ? "Sending..." : "Get The Smart Selection Sprint™"}
                  </Button>
                </form>

                {submitted && (
                  <div className="text-sm text-[#00D9FF] font-medium mb-6">
                    Check your inbox! The Smart Selection Sprint™ is on its way.
                  </div>
                )}

                <p className="text-sm text-slate-400">
                  No spam. No credit card. Unsubscribe anytime.
                </p>
              </div>

              {/* RIGHT: Image */}
              <div className="hidden md:block">
                <div className="relative group">
                  {/* Animated glow background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#00D9FF]/40 to-[#FF5744]/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

                  {/* Image container with border */}
                  <div className="relative bg-gradient-to-br from-[#00D9FF]/50 to-[#FF5744]/50 p-1 rounded-2xl overflow-hidden">
                    <div className="bg-[#0D1B2A] p-1 rounded-2xl overflow-hidden">
                      <img
                        src="/hero-composite.jpg"
                        alt="Transformation: From chaotic developer hiring to organized confident team collaboration"
                        className="w-full h-auto object-cover rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                      />
                    </div>
                  </div>

                  {/* Accent line */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#00D9FF] rounded-full opacity-0 group-hover:opacity-30 transition duration-300" />
                </div>
              </div>
            </div>

            {/* Mobile Image - Below Text */}
            <div className="md:hidden mt-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-[#00D9FF]/30 to-[#FF5744]/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-gradient-to-br from-[#00D9FF]/50 to-[#FF5744]/50 p-1 rounded-2xl overflow-hidden">
                  <div className="bg-[#0D1B2A] p-1 rounded-2xl overflow-hidden">
                    <img
                      src="/hero-composite.jpg"
                      alt="Transformation: From chaotic developer hiring to organized confident team collaboration"
                      className="w-full h-auto object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <p className="text-lg md:text-xl text-[#0D1B2A] leading-relaxed">
                The worst that happens? You get a bunch of copy-paste templates that make hiring easier. The best? You never make a bad developer hire again.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="px-5 py-4 rounded-lg border-2 border-[#00D9FF] bg-white text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]/50 flex-1 sm:flex-none transition"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#FF5744] hover:bg-[#E64A35] text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 whitespace-nowrap shadow-lg shadow-[#FF5744]/40"
                >
                  {isLoading ? "Sending..." : "Get Instant Access"}
                </Button>
              </form>

              {submitted && (
                <p className="text-sm text-[#00D9FF] font-medium text-center">
                  Check your inbox! The Smart Selection Sprint™ is on its way.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <p className="text-sm text-slate-500">
            © 2025 The Founder Link. Your bridge to world-class technical talent.
          </p>
        </div>
      </footer>
    </div>
  );
}
