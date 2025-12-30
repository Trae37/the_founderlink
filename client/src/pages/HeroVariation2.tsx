import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HeroVariation2() {
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
          <span className="text-xs text-slate-400">Variation 2: Image with Overlays & Design Elements</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-[#0D1B2A] to-[#0D1B2A] py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-2xl mx-auto text-center mb-16">
              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Bad Developer Hires Are Killing Your Startup. Here's How to Stop It.
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed">
                Find, vet, and hire the right developers in 7 days. No tech background needed.
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mb-6 max-w-lg mx-auto">
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

            {/* Image with Multiple Design Layers */}
            <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
              {/* Outer glow effect */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#FF5744]/20 via-[#00D9FF]/10 to-transparent blur-3xl rounded-full opacity-60" />

              {/* Main image container with border and effects */}
              <div className="relative group">
                {/* Animated background glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-[#00D9FF] via-[#FF5744] to-[#00D9FF] rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition duration-500 animate-pulse" />

                {/* Border frame */}
                <div className="relative bg-gradient-to-br from-[#00D9FF]/30 to-[#FF5744]/30 p-1 rounded-2xl">
                  {/* Inner dark border */}
                  <div className="bg-[#0D1B2A] p-1 rounded-2xl">
                    {/* Image */}
                    <img
                      src="/hero-composite.jpg"
                      alt="Transformation: From chaotic developer hiring to organized confident team collaboration"
                      className="w-full h-auto object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                </div>

                {/* Corner accent elements */}
                <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#00D9FF] rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-[#FF5744] rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>

              {/* Decorative elements below image */}
              <div className="mt-8 flex justify-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#00D9FF] opacity-60" />
                <div className="w-2 h-2 rounded-full bg-[#FF5744] opacity-60" />
                <div className="w-2 h-2 rounded-full bg-[#00D9FF] opacity-60" />
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
