import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#F3F2EE]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#d4d4d0] bg-[#F3F2EE]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-5 h-5 bg-black flex items-center justify-center rounded-sm">
              <span className="text-white font-mono font-medium text-xs">F</span>
            </div>
            <span className="font-medium tracking-tight text-sm text-neutral-800">FounderLink</span>
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Introduction</h2>
            <p className="text-neutral-700 mb-4">
              The Founder Link ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website thefounderlink.com and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Personal Information</h3>
            <p className="text-neutral-700 mb-4">
              We may collect personal information that you voluntarily provide when using our services, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Company or project name</li>
              <li>Assessment responses about your project needs</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-lg font-medium text-neutral-800 mb-2">Automatically Collected Information</h3>
            <p className="text-neutral-700 mb-4">
              When you visit our website, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-neutral-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Generate your personalized hiring blueprint and documents</li>
              <li>Process payments and send transaction confirmations</li>
              <li>Send you updates about your assessment results</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Information Sharing</h2>
            <p className="text-neutral-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (e.g., Stripe for payments, Resend for emails)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Data Security</h2>
            <p className="text-neutral-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Your Rights</h2>
            <p className="text-neutral-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-neutral-700 mb-4">
              To exercise these rights, please contact us at support@thefounderlink.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Cookies</h2>
            <p className="text-neutral-700 mb-4">
              We use essential cookies to ensure our website functions properly. We may also use analytics cookies to understand how visitors interact with our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-neutral-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">9. Contact Us</h2>
            <p className="text-neutral-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-neutral-700">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@thefounderlink.com" className="text-blue-600 hover:underline">
                support@thefounderlink.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
