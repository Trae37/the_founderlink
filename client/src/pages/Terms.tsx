import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-700 mb-4">
              By accessing and using The Founder Link website and services ("Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Description of Services</h2>
            <p className="text-neutral-700 mb-4">
              The Founder Link provides tools and resources to help non-technical founders hire developers, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Free developer hiring assessment</li>
              <li>Personalized hiring recommendations</li>
              <li>Paid hiring blueprint documents (PRD, Hiring Playbook, etc.)</li>
              <li>Consultation services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. User Accounts and Registration</h2>
            <p className="text-neutral-700 mb-4">
              To access certain features, you may need to provide personal information. You agree to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Keep your information up to date</li>
              <li>Be responsible for all activity associated with your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Payments and Refunds</h2>
            <p className="text-neutral-700 mb-4">
              <strong>Payment Processing:</strong> All payments are processed securely through Stripe. We do not store your credit card information.
            </p>
            <p className="text-neutral-700 mb-4">
              <strong>Digital Products:</strong> Due to the nature of digital products, all sales of document blueprints are final. However, if you experience technical issues receiving your documents, please contact us at support@thefounderlink.com and we will resolve the issue.
            </p>
            <p className="text-neutral-700 mb-4">
              <strong>Refund Policy:</strong> We offer refunds within 7 days of purchase if you are unsatisfied with the quality of the documents provided. To request a refund, email support@thefounderlink.com with your order details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Intellectual Property</h2>
            <p className="text-neutral-700 mb-4">
              <strong>Our Content:</strong> All content on The Founder Link website, including text, graphics, logos, and software, is our property and protected by intellectual property laws.
            </p>
            <p className="text-neutral-700 mb-4">
              <strong>Your Documents:</strong> The documents we generate for you (PRD, Hiring Playbook, etc.) are yours to use for your business purposes. You may share them with potential developers, contractors, and team members.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Prohibited Uses</h2>
            <p className="text-neutral-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Use our Services for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Resell or redistribute our documents commercially</li>
              <li>Use automated systems to access our Services without permission</li>
              <li>Interfere with the proper functioning of our Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-neutral-700 mb-4">
              Our Services are provided "as is" without warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4 space-y-2">
              <li>Our recommendations will result in successful developer hires</li>
              <li>The documents will be suitable for your specific legal or business needs</li>
              <li>Our Services will be uninterrupted or error-free</li>
            </ul>
            <p className="text-neutral-700 mb-4">
              The hiring playbook and working agreement templates are for informational purposes and should be reviewed by legal counsel before use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-neutral-700 mb-4">
              To the maximum extent permitted by law, The Founder Link shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">9. Changes to Terms</h2>
            <p className="text-neutral-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on our website. Continued use of our Services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">10. Governing Law</h2>
            <p className="text-neutral-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Contact Us</h2>
            <p className="text-neutral-700 mb-4">
              If you have questions about these Terms, please contact us at:
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
