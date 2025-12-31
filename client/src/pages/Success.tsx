import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Mail, Calendar, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Success() {
  const [, navigate] = useLocation();
  const [userEmail, setUserEmail] = useState("");

  const stripeSessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("session_id") || "";
  }, []);

  const downloadsQuery = trpc.documents.getBlueprintDownloads.useQuery(
    { stripeSessionId },
    {
      enabled: Boolean(stripeSessionId),
      refetchInterval: (query) => {
        const data = query.state.data;
        if (!data) return 2000;
        return data.status === "ready" ? false : 2000;
      },
    }
  );

  useEffect(() => {
    // Get email from session storage
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const documentsBySlug = useMemo(() => {
    const d = downloadsQuery.data;
    if (!d || d.status !== "ready") return null;

    const bySlug: Record<string, string> = {};
    for (const doc of d.documents) {
      bySlug[doc.slug] = doc.downloadUrl;
    }
    return bySlug;
  }, [downloadsQuery.data]);

  const zipUrl = useMemo(() => {
    if (!stripeSessionId) return "";
    return `/api/blueprint/${encodeURIComponent(stripeSessionId)}/download.zip`;
  }, [stripeSessionId]);

  return (
    <div className="min-h-screen relative bg-[#F3F2EE] text-[#111110]">
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
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#d4d4d0] bg-[#F3F2EE]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-5 h-5 bg-black flex items-center justify-center rounded-sm transition-transform group-hover:rotate-12">
              <span className="text-white font-mono font-medium text-xs">F</span>
            </div>
            <span className="font-medium tracking-tight text-sm text-neutral-800">FounderLink</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Payment Success</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Success Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full border-2 border-emerald-500 mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 mb-4">
            You're All Set!
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Your complete Hiring Blueprint is on its way to your inbox
          </p>
        </div>

        {/* Email Confirmation */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-sm flex items-center justify-center">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-neutral-900 mb-3 tracking-tight">Check Your Email</h2>
              <p className="text-neutral-600 mb-4">
                Your Full Hiring Blueprint will arrive within 5 minutes at:
              </p>
              <div className="bg-neutral-50 border border-neutral-200 rounded-sm px-4 py-3 font-mono text-sm text-neutral-900 mb-6">
                {userEmail || "your email address"}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4 documents (Clarity Brief, Hiring Playbook, PRD, Working Agreement)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered as attachments (Word or Markdown)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PDF support is coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downloads (re-download) */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-12 shadow-sm">
          {/* Disclaimer */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-sm">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> It may take a few minutes for your documents to appear here while our system enhances them.
              Don't worry - they'll also be sent directly to your email, so check your inbox!
            </p>
          </div>

          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-neutral-900 mb-2 tracking-tight">Download Your Documents</h2>
              <p className="text-neutral-600">
                Save these files so you can share them with developers and re-open them anytime.
              </p>
              {!stripeSessionId && (
                <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
                  This download page needs a Stripe <span className="font-mono">session_id</span> in the URL.
                </p>
              )}
              {downloadsQuery.error && (
                <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                  We couldn’t load your download links. Please refresh, or check your email for the attachments.
                </p>
              )}
              {stripeSessionId && downloadsQuery.data?.status === "processing" && (
                <div className="mt-4 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-sm px-4 py-3">
                  <div className="font-medium text-neutral-900 mb-1">Generating your files…</div>
                  <div className="text-neutral-600">{downloadsQuery.data.message}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DownloadCard
              title="Project Clarity Brief"
              description="A clean summary of your idea, scope, and recommended route."
              href={documentsBySlug?.["clarity-brief"]}
              imageSrc={docCoverDataUri("Project\nClarity\nBrief", "#06b6d4")}
              disabled={!documentsBySlug}
            />
            <DownloadCard
              title="Hiring Playbook"
              description="Where to source, how to vet, and how to run interviews."
              href={documentsBySlug?.["hiring-playbook"]}
              imageSrc={docCoverDataUri("Hiring\nPlaybook", "#f59e0b")}
              disabled={!documentsBySlug}
            />
            <DownloadCard
              title="PRD"
              description="A developer-ready set of requirements and acceptance criteria."
              href={documentsBySlug?.["prd"]}
              imageSrc={docCoverDataUri("PRD", "#111827")}
              disabled={!documentsBySlug}
            />
            <DownloadCard
              title="Working Agreement"
              description="A working agreement template to reduce scope creep."
              href={documentsBySlug?.["working-agreement"]}
              imageSrc={docCoverDataUri("Working\nAgreement", "#10b981")}
              disabled={!documentsBySlug}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => downloadsQuery.refetch()}
              className="border border-neutral-300 text-neutral-900 px-5 py-2.5 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
              disabled={!stripeSessionId}
            >
              Refresh
            </button>
            {documentsBySlug ? (
              <a
                href={zipUrl}
                className="inline-flex items-center justify-center bg-black text-white px-5 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors font-medium"
              >
                Download all (ZIP)
              </a>
            ) : (
              <button
                className="bg-neutral-100 text-neutral-500 px-5 py-2.5 rounded-sm font-medium cursor-not-allowed"
                disabled
              >
                Download all (ZIP)
              </button>
            )}
          </div>
        </div>

        {/* Calendly CTA */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-sm p-8 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-amber-500 rounded-sm flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-medium text-neutral-900 mb-2 tracking-tight">Book Your Free Review Call</h3>
              <p className="text-neutral-700 mb-4">
                Let's walk through your Blueprint together. This 30-minute call is included - schedule it now while it's fresh.
              </p>
              <a
                href="https://calendly.com/thefounderlink"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-sm hover:bg-amber-600 active:scale-95 transition-all font-semibold shadow-md"
              >
                <Calendar className="w-5 h-5" />
                Schedule Your Call
              </a>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-12 shadow-sm">
          <h3 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">What Happens Next</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-sm bg-black text-white font-mono font-medium">
                  1
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-900 mb-1">Download Your Documents</h4>
                <p className="text-neutral-600">Open the email and grab your 4 documents in whichever format works best for you (Word or Markdown)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-sm bg-black text-white font-mono font-medium">
                  2
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-900 mb-1">Schedule Your Review Call</h4>
                <p className="text-neutral-600">Book your free 30-minute call above - we'll review the documents together and answer any questions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-sm bg-black text-white font-mono font-medium">
                  3
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-900 mb-1">Start Hiring</h4>
                <p className="text-neutral-600">Use your Blueprint to write job posts, evaluate candidates, and hire the right developer with confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadCard({
  title,
  description,
  href,
  imageSrc,
  disabled,
}: {
  title: string;
  description: string;
  href?: string;
  imageSrc: string;
  disabled: boolean;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-5 hover:border-neutral-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-mono uppercase tracking-wider text-neutral-500">Document</div>
          <div className="text-lg font-medium text-neutral-900 mt-1">{title}</div>
          <div className="text-sm text-neutral-600 mt-2">{description}</div>
        </div>
        <div className="flex-shrink-0 w-20 h-24 border border-neutral-200 rounded-sm bg-neutral-50 overflow-hidden">
          <img src={imageSrc} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mt-4">
        {disabled ? (
          <button
            className="w-full bg-neutral-100 text-neutral-500 px-4 py-2 rounded-sm font-medium cursor-not-allowed"
            disabled
          >
            Preparing…
          </button>
        ) : (
          <a
            href={href}
            className="inline-flex items-center justify-center w-full bg-black text-white px-4 py-2 rounded-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}

function docCoverDataUri(title: string, accent: string) {
  const safeTitle = title
    .split("\n")
    .map((x) => x.replace(/[<>&]/g, ""))
    .join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f5f5f4"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="200" height="260" rx="10" fill="url(#g)"/>
  <rect x="0" y="0" width="200" height="10" fill="${accent}"/>
  <rect x="16" y="28" width="168" height="1" fill="#e7e5e4"/>
  <text x="20" y="70" fill="#111827" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="18" font-weight="700" xml:space="preserve">${safeTitle}</text>
  <rect x="20" y="120" width="160" height="10" rx="5" fill="#e7e5e4"/>
  <rect x="20" y="140" width="140" height="10" rx="5" fill="#e7e5e4"/>
  <rect x="20" y="160" width="150" height="10" rx="5" fill="#e7e5e4"/>
  <rect x="20" y="190" width="100" height="10" rx="5" fill="#e7e5e4"/>
  <rect x="20" y="210" width="120" height="10" rx="5" fill="#e7e5e4"/>
  <rect x="20" y="232" width="80" height="10" rx="5" fill="#e7e5e4"/>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
