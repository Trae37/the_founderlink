import { useLocation } from "wouter";

export default function VersionD() {
  const [, navigate] = useLocation();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0F1B2E" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(15, 27, 46, 0.95)", borderBottom: "1px solid #00D9FF" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="The Founder Link" className="h-8 w-8" />
            <span className="font-bold text-lg tracking-tight" style={{ color: "#00D9FF" }}>THE FOUNDER LINK</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="text-sm transition" style={{ color: "#00D9FF" }}>
              Version B (Green)
            </button>
            <button onClick={() => navigate("/version-d")} className="text-sm transition" style={{ color: "#FF006E" }}>
              Version D (Cyberpunk)
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION WITH IMAGE */}
        <section className="py-20 md:py-32 px-6 relative overflow-hidden" style={{ backgroundColor: "#0F1B2E" }}>
          {/* Background Image */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('/hero-cyberpunk.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
          
          {/* Overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15, 27, 46, 0.7)" }}></div>

          <div className="container mx-auto max-w-3xl text-center relative z-10">
            {/* Headline with Accent Colors */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ color: "#FFFFFF" }}>
              Stop Losing Time and Money on{" "}
              <span style={{ color: "#FF006E", textShadow: "0 0 20px #FF006E" }}>Bad Developer Hires</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: "#00D9FF" }}>
              Hire the right developers in 7 days, even without a tech background. Get your Smart Fit Snapshot within 24 hours to know exactly which devs you need.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/email-capture")}
                className="px-8 py-4 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: "#FF006E",
                  boxShadow: "0 0 20px #FF006E"
                }}
              >
                Start Your Smart Fit Assessment →
              </button>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 rounded-full font-bold border-2 transition-all duration-200 hover:bg-opacity-10"
                style={{ 
                  color: "#00D9FF", 
                  borderColor: "#00D9FF",
                  boxShadow: "0 0 10px #00D9FF"
                }}
              >
                Learn More
              </button>
            </div>

            {/* Trust Statement */}
            <p className="text-sm" style={{ color: "#00D9FF" }}>
              Get it absolutely free. Unsubscribe anytime. Results delivered instantly.
            </p>
          </div>
        </section>



        {/* WHY CHOOSE SECTION */}
        <section id="features-section" className="py-20 px-6" style={{ backgroundColor: "#1A2F45" }}>
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-16" style={{ color: "#00D9FF" }}>How The Smart Fit Assessment Works</h2>
                       <div className="grid md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="flex gap-6 p-6 rounded-lg" style={{ backgroundColor: "#0F1B2E", border: "1px solid #00D9FF" }}>
                <span className="text-4xl font-bold" style={{ color: "#00D9FF" }}>1</span>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#FF006E" }}>Never Waste Time on Wrong Developers</h3>
                  <p style={{ color: "#CCCCCC" }}>
                    Get laser-focused clarity on the exact skills you need. Every hire moves your startup forward fast.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6 p-6 rounded-lg" style={{ backgroundColor: "#0F1B2E", border: "1px solid #FF006E" }}>
                <div className="text-4xl font-bold" style={{ color: "#FF006E" }}>2</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#00D9FF" }}>Attract Top-Tier Developers Who Actually Want to Work With You</h3>
                  <p style={{ color: "#CCCCCC" }}>
                    Receive a personalized hiring profile that makes your offer irresistible to the right talent.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6 p-6 rounded-lg" style={{ backgroundColor: "#0F1B2E", border: "1px solid #00D9FF" }}>
                <div className="text-4xl font-bold" style={{ color: "#00D9FF" }}>3</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#FF006E" }}>Get Your Hiring Game Started Within 24 Hours</h3>
                  <p style={{ color: "#CCCCCC" }}>
                    No waiting, no second guessing. Start evaluating candidates with confidence the same day you sign up.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6 p-6 rounded-lg" style={{ backgroundColor: "#0F1B2E", border: "1px solid #FF006E" }}>
                <div className="text-4xl font-bold" style={{ color: "#FF006E" }}>4</div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#00D9FF" }}>Build a Tech Team That Scales Without the Headaches</h3>
                  <p style={{ color: "#CCCCCC" }}>
                    Know exactly who to hire, when to hire, and how to build a team that grows with your vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6" style={{ backgroundColor: "#0F1B2E", borderTop: "1px solid #00D9FF" }}>
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#00D9FF" }}>
              Ready to Hire the Right Developers?
            </h2>
            <p className="text-lg mb-10" style={{ color: "#CCCCCC" }}>
              Take a quick 5-minute assessment and receive your personalized hiring report instantly—no lengthy surveys, just targeted questions tailored to your startup's needs.
            </p>
            <button
              onClick={() => navigate("/email-capture")}
              className="px-10 py-5 rounded-full font-bold text-white text-lg transition-all duration-200 transform hover:scale-105"
              style={{ 
                backgroundColor: "#FF006E",
                boxShadow: "0 0 30px #FF006E"
              }}
            >
              Start Your Smart Fit Assessment
            </button>
            <p className="text-sm mt-6" style={{ color: "#00D9FF" }}>
              Takes about 5 minutes. Results delivered instantly.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6" style={{ borderTop: "1px solid #FF006E" }}>
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-sm" style={{ color: "#00D9FF" }}>
              The Founder Link • Your bridge to world-class technical talent.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
