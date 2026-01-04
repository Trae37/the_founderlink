import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Mail,
  Lightbulb,
  Target,
  CheckCircle2,
  Check,
  FileText
} from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen relative bg-[#F3F2EE] text-[#111110] flex flex-col">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(#d4d4d0 1px, transparent 1px),
            linear-gradient(90deg, #d4d4d0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/40 bg-white/50 backdrop-blur-xl shadow-lg" style={{ backdropFilter: 'blur(40px) saturate(180%) brightness(1.1)', WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(1.1)', background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-5 h-5 bg-black flex items-center justify-center rounded-sm transition-transform group-hover:rotate-12">
              <span className="text-white font-mono font-medium text-xs">F</span>
            </div>
            <span className="font-medium tracking-tight text-sm text-neutral-800">The Founder Link</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Status: Accepting Founders</span>
            <button 
              onClick={() => navigate("/assessment")}
              className="bg-black text-white px-4 py-1.5 text-xs font-medium rounded-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm"
            >
              Get Snapshot
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered */}
      <main className="flex-1 flex items-center justify-center z-10 px-6">
        <div className="max-w-3xl mx-auto text-center py-20">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 mb-8 border border-neutral-300 bg-white px-2 py-1 rounded-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">BETA ACCESS OPEN</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Don't hire your first developer blind.
          </h1>

          {/* Subheadline */}
          <div className="text-lg md:text-xl text-neutral-600 mb-12 space-y-3 max-w-2xl mx-auto">
            <p>
              <span className="font-semibold text-neutral-800">Free 8-10-minute assessment</span> → instant build route + first hire role.
            </p>
            <p>
              <span className="font-semibold text-neutral-800">Optional upgrade</span> → the Hiring Blueprint (4 tailored docs you can hand to a developer).
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => navigate("/assessment")}
              size="lg"
              className="bg-black text-white hover:bg-neutral-800 px-8 py-6 text-base font-medium rounded-sm shadow-lg hover:shadow-xl transition-all active:scale-95 group"
            >
              Start my free Smart Fit Snapshot
              <svg 
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No card
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                8-10 mins
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private
              </span>
            </div>
          </div>

          {/* The Bridge Visualization */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="relative bg-white border border-neutral-200 rounded-sm shadow-lg p-8 md:p-12">
              {/* Main Flow */}
              <div className="flex items-center justify-between gap-2 md:gap-4">
                {/* Left Node: "Your Idea" */}
                <div className="relative">
                  {/* Floating Tags (Hidden on mobile) */}
                  <div className="hidden md:block absolute -top-4 -left-4 animate-[float_3s_ease-in-out_infinite_0.1s]">
                    <div className="bg-neutral-100 border border-neutral-200 text-neutral-400 px-2 py-0.5 rounded-sm text-[10px] font-mono">Timeline?</div>
                  </div>
                  <div className="hidden md:block absolute -bottom-6 -right-2 animate-[float_3s_ease-in-out_infinite_1s]">
                    <div className="bg-neutral-100 border border-neutral-200 text-neutral-400 px-2 py-0.5 rounded-sm text-[10px] font-mono">Budget?</div>
                  </div>
                  <div className="hidden md:block absolute -top-6 right-0 animate-[float_3s_ease-in-out_infinite_2s]">
                    <div className="bg-neutral-100 border border-neutral-200 text-neutral-400 px-2 py-0.5 rounded-sm text-[10px] font-mono">Features?</div>
                  </div>
                  {/* Main Card */}
                  <div className="w-32 md:w-44 bg-white border border-neutral-200 rounded-sm shadow-sm p-3 relative z-10">
                    <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Lightbulb className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-medium text-neutral-900">Your Idea</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[9px] text-neutral-500 font-mono">Product type</div>
                      <div className="text-[9px] text-neutral-500 font-mono">Timeline</div>
                      <div className="text-[9px] text-neutral-500 font-mono">Budget</div>
                    </div>
                  </div>
                </div>
                {/* The Bridge / Connector */}
                <div className="flex-1 relative h-12 flex items-center justify-center mx-1 md:mx-4">
                  {/* SVG Line */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" className="animate-[flowDash_1s_linear_infinite] opacity-40" />
                  </svg>
                  
                  {/* Central Badge */}
                  <div className="relative z-20 bg-white border border-amber-200 shadow-sm px-2.5 py-1.5 rounded-full flex flex-col items-center gap-0.5 min-w-[85px] md:min-w-[95px]">
                    <span className="text-[9px] md:text-[10px] font-semibold text-amber-600 tracking-tight uppercase">Assessment</span>
                    <span className="text-[8px] text-neutral-400 font-mono">8-10 MIN</span>
                  </div>
                </div>
                {/* Right Node: "Clear Path" */}
                <div className="relative">
                  {/* Success Indicator */}
                  <div className="absolute -top-3 -right-3 z-30">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  {/* Main Card */}
                  <div className="w-32 md:w-44 bg-white border border-neutral-900 rounded-sm shadow-md p-3 relative z-10 ring-1 ring-neutral-900/5">
                    <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center text-white">
                        <Target className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-medium text-neutral-900">Clear Path</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                        <span className="text-[9px] text-neutral-700 font-medium">Build route</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                        <span className="text-[9px] text-neutral-700 font-medium">First hire role</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-2.5 h-2.5 text-amber-600" />
                        <span className="text-[9px] text-neutral-500">+Blueprint</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Label */}
              <div className="mt-8 text-center">
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">From Confusion to Clarity in Minutes</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#d4d4d0] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-neutral-900 rounded-sm"></div>
            <span className="font-medium text-sm tracking-tight text-neutral-900">The Founder Link</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
            <span>© 2026 The Founder Link</span>
            <span className="text-neutral-300">|</span>
            <a href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-neutral-900 transition-colors">Terms</a>
          </div>

          <div className="flex gap-6 items-center">
            <a 
              href="https://techtalentblueprint.beehiiv.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-black transition-colors flex items-center gap-2 text-xs font-mono"
              title="Subscribe to Tech Talent Blueprint Newsletter"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </a>
            <a 
              href="https://x.com/MaysTrashard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-black transition-colors"
              title="Follow us on X"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
