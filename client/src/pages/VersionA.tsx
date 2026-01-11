export default function VersionA() {
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
                  Stop Guessing How to Hire Your First Developer
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl font-semibold text-slate-700 mb-6 leading-relaxed">
                  Get a free, custom build roadmap and role description in 10 minutes. Perfect for non-technical founders.
                </p>

                {/* Body */}
                <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                  Don't burn your budget on the wrong hire. Answer a few questions about your idea, timeline, and budget to get an instant hiring strategy.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Instant analysis of your project scope
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Clear recommendation: Agency vs. Freelancer vs. CTO
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Actionable next steps to start building today
                  </li>
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a
                    href="/assessment"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 whitespace-nowrap shadow-lg shadow-pink-500/30 text-center"
                  >
                    Get My Free Hiring Roadmap
                  </a>
                  <a
                    href="#how-it-works"
                    className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold px-8 py-4 rounded-lg transition-all duration-200 whitespace-nowrap text-center"
                  >
                    See how it works
                  </a>
                </div>

                {/* Trust Line */}
                <p className="text-sm text-slate-600">
                  100% Private • No Credit Card Required
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
                  Stop Guessing How to Hire Your First Developer
                </h1>

                {/* Subheadline */}
                <p className="text-base md:text-lg font-semibold text-slate-700 mb-4 leading-relaxed">
                  Get a free, custom build roadmap and role description in 10 minutes. Perfect for non-technical founders.
                </p>

                {/* Body */}
                <p className="text-base text-slate-600 mb-6 leading-relaxed">
                  Don't burn your budget on the wrong hire. Answer a few questions about your idea, timeline, and budget to get an instant hiring strategy.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Instant analysis of your project scope
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Clear recommendation: Agency vs. Freelancer vs. CTO
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <span className="text-pink-500 font-bold">✓</span>
                    Actionable next steps to start building today
                  </li>
                </ul>

                {/* CTAs */}
                <div className="flex flex-col gap-3 mb-6">
                  <a
                    href="/assessment"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg shadow-pink-500/30 text-center"
                  >
                    Get My Free Hiring Roadmap
                  </a>
                  <a
                    href="#how-it-works"
                    className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold px-8 py-4 rounded-lg transition-all duration-200 text-center"
                  >
                    See how it works
                  </a>
                </div>

                {/* Trust Line */}
                <p className="text-sm text-slate-600">
                  100% Private • No Credit Card Required
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">
                Get Your Free Hiring Roadmap
              </h2>
              <p className="text-lg text-slate-700">
                Answer a few questions about your idea, timeline, and budget. Get an instant, custom hiring strategy.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a href="/assessment" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-5 rounded-lg text-lg transition-all duration-200 shadow-lg shadow-pink-500/30">
                Get My Free Hiring Roadmap
              </a>
              <p className="text-sm text-slate-600 mt-4">
                100% Private • No Credit Card Required
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
