import { useLocation } from "wouter";

export default function VersionE() {
  const [, navigate] = useLocation();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFBF0" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(255, 251, 240, 0.95)", borderBottom: "1px solid #E0E0E0" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="The Founder Link" className="h-8 w-8" />
            <span className="font-bold text-lg tracking-tight" style={{ color: "#222222" }}>THE FOUNDER LINK</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="text-sm transition" style={{ color: "#666666" }}>
              Version B (Green)
            </button>
            <button onClick={() => navigate("/version-e")} className="text-sm transition" style={{ color: "#007BFF" }}>
              Version E (Refined)
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 px-6" style={{ backgroundColor: "#FFFBF0" }}>
          <div className="container mx-auto max-w-3xl text-center">
            {/* Headline with Blue and Pink Accents */}
             <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl mx-auto" style={{ color: "#222222" }}>
              Stop Losing Time and Money on <span style={{ color: "#007BFF" }}>Bad Developer Hires</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: "#555555" }}>
              Hire the right developers in 7 days, even without a tech background. Get your Smart Fit Snapshot within 24 hours to know exactly which devs you need.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button
                    onClick={() => navigate("/email-capture")}
                    className="px-8 py-4 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90"
                    style={{ 
                      backgroundColor: "#007BFF",
                      boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)"
                    }}
                  >
                    Start Your Smart Fit Assessment
                  </button>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 rounded-full font-bold border-2 transition-all duration-200"
                style={{ 
                  color: "#222222", 
                  borderColor: "#222222"
                }}
              >
                Learn More
              </button>
            </div>

            {/* FRAMED IMAGE */}
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="relative rounded-lg overflow-hidden border-8" style={{ borderColor: "#007BFF", boxShadow: "0 10px 40px rgba(0, 123, 255, 0.2)" }}>
                <img src="/hero-cyberpunk.jpg" alt="Founder and Developer Connection" className="w-full h-auto" />
              </div>
            </div>

            {/* Trust Statement */}
            <p className="text-sm" style={{ color: "#666666" }}>
              Get it absolutely free. Unsubscribe anytime. Results delivered instantly.
            </p>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features-section" className="py-20 px-6" style={{ backgroundColor: "#FFFBF0" }}>
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-16" style={{ color: "#222222" }}>
              How The Smart Fit Assessment Works
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold flex-shrink-0" style={{ color: "#007BFF" }}>1</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>
                    Never Waste Time on <span style={{ color: "#007BFF" }}>Wrong Developers</span>
                  </h3>
                  <p style={{ color: "#555555" }}>
                    Get laser-focused clarity on the exact skills you need. Every hire moves your startup forward fast.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold flex-shrink-0" style={{ color: "#007BFF" }}>2</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>
                    Attract <span style={{ color: "#007BFF" }}>Top-Tier Developers</span> Who Actually Want to Work With You
                  </h3>
                  <p style={{ color: "#555555" }}>
                    Receive a personalized hiring profile that makes your offer irresistible to the right talent.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold flex-shrink-0" style={{ color: "#007BFF" }}>3</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>
                    Get Your Hiring Game Started Within <span style={{ color: "#007BFF" }}>24 Hours</span>
                  </h3>
                  <p style={{ color: "#555555" }}>
                    No waiting, no second guessing. Start evaluating candidates with confidence the same day you sign up.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold flex-shrink-0" style={{ color: "#007BFF" }}>4</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>
                    Build a <span style={{ color: "#007BFF" }}>Tech Team That Scales</span> Without the Headaches
                  </h3>
                  <p style={{ color: "#555555" }}>
                    Know exactly who to hire, when to hire, and how to build a team that grows with your vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6" style={{ backgroundColor: "#F4F4F4" }}>
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#222222" }}>
              Ready to Hire the <span style={{ color: "#007BFF" }}>Right Developers</span>?
            </h2>
            <p className="text-lg mb-10" style={{ color: "#555555" }}>
              Take a quick 5-minute assessment and receive your personalized hiring report instantly—no lengthy surveys, just targeted questions tailored to your startup's needs.
            </p>
            <button
              onClick={() => navigate("/email-capture")}
              className="px-10 py-5 rounded-full font-bold text-white text-lg transition-all duration-200 transform hover:scale-105"
              style={{ 
                backgroundColor: "#FF006E",
                boxShadow: "0 4px 15px rgba(255, 0, 110, 0.3)"
              }}
            >
              Start Your Smart Fit Assessment
            </button>
            <p className="text-sm mt-6" style={{ color: "#666666" }}>
              Takes about 5 minutes. Results delivered instantly.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6" style={{ backgroundColor: "#FFFBF0", borderTop: "1px solid #E0E0E0" }}>
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: "#666666" }}>
              © 2026 The Founder Link
            </p>
            <div className="flex gap-4 text-sm" style={{ color: "#666666" }}>
              <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
