import { useLocation } from "wouter";

export default function VersionC() {
  const [, navigate] = useLocation();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(250, 249, 246, 0.95)", borderBottom: "1px solid #E0E0E0" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="The Founder Link" className="h-8 w-8" />
            <span className="font-bold text-lg tracking-tight" style={{ color: "#222222" }}>THE FOUNDER LINK</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="text-sm transition" style={{ color: "#666666" }}>
              Version B (Green)
            </button>
            <button onClick={() => navigate("/version-c")} className="text-sm transition" style={{ color: "#666666" }}>
              Version C (Blue)
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            {/* Headline with Accent Color */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ color: "#222222" }}>
              Stop Losing Time and Money on{" "}
              <span style={{ color: "#007BFF" }}>Bad Developer Hires</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: "#555555" }}>
              Hire the right developers in 7 days, even without a tech background. Get your Smart Fit Snapshot within 24 hours to know exactly which devs you need.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/email-capture")}
                className="px-8 py-4 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#007BFF" }}
              >
                Start Your Smart Fit Assessment →
              </button>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 rounded-full font-bold border-2 transition-all duration-200 hover:bg-gray-50"
                style={{ color: "#222222", borderColor: "#E0E0E0" }}
              >
                Learn More
              </button>
            </div>

            {/* Trust Statement */}
            <p className="text-sm" style={{ color: "#999999" }}>
              Get it absolutely free. Unsubscribe anytime. Results delivered instantly.
            </p>
          </div>
        </section>



        {/* WHY CHOOSE SECTION */}
        <section id="features-section" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-16" style={{ color: "#222222" }}>How The Smart Fit Assessment Works</h2>
                       <div className="grid md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold" style={{ color: "#28A745" }}>1</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>Never Waste Time on Wrong Developers</h3>
                  <p style={{ color: "#555555" }}>
                    Get laser-focused clarity on the exact skills you need. Every hire moves your startup forward fast.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold" style={{ color: "#28A745" }}>2</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>Attract Top-Tier Developers Who Actually Want to Work With You</h3>
                  <p style={{ color: "#555555" }}>
                    Receive a personalized hiring profile that makes your offer irresistible to the right talent.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold" style={{ color: "#28A745" }}>3</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>Get Your Hiring Game Started Within 24 Hours</h3>
                  <p style={{ color: "#555555" }}>
                    No waiting, no second guessing. Start evaluating candidates with confidence the same day you sign up.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold" style={{ color: "#28A745" }}>4</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#222222" }}>Build a Tech Team That Scales Without the Headaches</h3>
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
              Ready to Hire the Right Developers?
            </h2>
            <p className="text-lg mb-10" style={{ color: "#555555" }}>
              Take a quick 5-minute assessment and receive your personalized hiring report instantly—no lengthy surveys, just targeted questions tailored to your startup's needs.
            </p>
            <button
              onClick={() => navigate("/email-capture")}
              className="px-10 py-5 rounded-full font-bold text-white text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ backgroundColor: "#007BFF" }}
            >
              Start Your Smart Fit Assessment
            </button>
            <p className="text-sm mt-6" style={{ color: "#999999" }}>
              Takes about 5 minutes. Results delivered instantly.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6" style={{ borderTop: "1px solid #E0E0E0" }}>
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: "#999999" }}>
              © 2026 The Founder Link
            </p>
            <div className="flex gap-4 text-sm" style={{ color: "#999999" }}>
              <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
