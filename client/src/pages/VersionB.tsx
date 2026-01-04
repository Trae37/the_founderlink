import { useState } from "react";
import { useLocation } from "wouter";

export default function VersionB() {
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
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200" style={{ backgroundColor: "rgba(255, 251, 240, 0.95)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="The Founder Link" className="h-8 w-8" />
            <span className="font-bold text-slate-950 text-lg tracking-tight">THE FOUNDER LINK</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="text-sm text-slate-600 hover:text-slate-950 transition">
              Version B (Green)
            </button>
            <button onClick={() => navigate("/version-e")} className="text-sm text-slate-600 hover:text-slate-950 transition">
              Version E (Refined)
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            {/* Headline with Accent Color */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-950 mb-8 leading-tight">
              Stop Losing Time and Money on{" "}
              <span style={{ color: "#0066CC" }}>Bad Developer Hires</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-700 mb-12 leading-relaxed max-w-2xl mx-auto">
              Hire the right developers in 7 days, even without a tech background. Get your Smart Fit Snapshot within 24 hours to know exactly which devs you need.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/email-capture")}
                className="px-8 py-4 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
                style={{ 
                  backgroundColor: "#0066CC",
                  boxShadow: "0 8px 20px rgba(34, 197, 94, 0.4), inset -2px -2px 5px rgba(0, 0, 0, 0.1), inset 2px 2px 5px rgba(255, 255, 255, 0.3)"
                }}
              >
                Start Your Smart Fit Assessment →             </button>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 rounded-full font-bold text-slate-950 border-2 border-slate-950 transition-all duration-200 hover:bg-slate-50"
              >
                Learn More
              </button>
            </div>

            {/* Trust Statement */}
            <p className="text-sm text-slate-600">
              Get it absolutely free. Unsubscribe anytime. Results delivered instantly.
            </p>
          </div>
        </section>



        {/* WHY CHOOSE SECTION */}
        <section id="features-section" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-slate-950 mb-16">How The Smart Fit Assessment Works</h2>
                       <div className="grid md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <span className="text-4xl font-bold inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ 
                  color: "#FFFFFF",
                  backgroundColor: "#0066CC",
                  boxShadow: "0 6px 15px rgba(34, 197, 94, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px rgba(255, 255, 255, 0.3)"
                }}>1</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-3">Never Waste Time on Wrong Developers</h3>
                  <p className="text-slate-700">
                    Get laser-focused clarity on the exact skills you need. Every hire moves your startup forward fast.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ 
                  color: "#FFFFFF",
                  backgroundColor: "#0066CC",
                  boxShadow: "0 6px 15px rgba(34, 197, 94, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px rgba(255, 255, 255, 0.3)"
                }}>2</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-3">Attract Top-Tier Developers Who Actually Want to Work With You</h3>
                  <p className="text-slate-700">
                    Receive a personalized hiring profile that makes your offer irresistible to the right talent.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ 
                  color: "#FFFFFF",
                  backgroundColor: "#0066CC",
                  boxShadow: "0 6px 15px rgba(34, 197, 94, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px rgba(255, 255, 255, 0.3)"
                }}>3</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-3">Get Your Hiring Game Started Within 24 Hours</h3>
                  <p className="text-slate-700">
                    No waiting, no second guessing. Start evaluating candidates with confidence the same day you sign up.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6">
                <div className="text-4xl font-bold inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ 
                  color: "#FFFFFF",
                  backgroundColor: "#0066CC",
                  boxShadow: "0 6px 15px rgba(34, 197, 94, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px rgba(255, 255, 255, 0.3)"
                }}>4</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-3">Build a Tech Team That Scales Without the Headaches</h3>
                  <p className="text-slate-700">
                    Know exactly who to hire, when to hire, and how to build a team that grows with your vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS FLOW SECTION */}
        <section className="py-20 px-6" style={{ backgroundColor: "#FFFBF0" }}>
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-slate-950 mb-16">Your Path to Hiring Success</h2>
            <img src="/process-flow.png" alt="4-Step Process: Diagnose, Clarity, Blueprint, Hire" className="w-full max-w-4xl mx-auto" />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6" style={{ backgroundColor: "#FFF0E6" }}>
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6">
              Ready to Hire the Right Developers?
            </h2>
            <p className="text-lg text-slate-700 mb-10">
              Take a quick 5-minute assessment and receive your personalized hiring report instantly - no lengthy surveys, just targeted questions tailored to your startup's needs.
            </p>
            <button
              onClick={() => navigate("/email-capture")}
              className="px-10 py-5 rounded-full font-bold text-white text-lg transition-all duration-200 transform hover:scale-105"
              style={{ 
                backgroundColor: "#0066CC",
                boxShadow: "0 8px 20px rgba(34, 197, 94, 0.4), inset -2px -2px 5px rgba(0, 0, 0, 0.1), inset 2px 2px 5px rgba(255, 255, 255, 0.3)"
              }}
            >
              Start Your Smart Fit Assessment
            </button>
            <p className="text-sm text-slate-600 mt-6">
              Takes about 5 minutes. Results delivered instantly.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-200">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2026 The Founder Link
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
