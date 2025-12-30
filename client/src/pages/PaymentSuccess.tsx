import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [product, setProduct] = useState("unknown");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    context: "",
  });
  const submitIntakeMutation = trpc.intake.submitIntake.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product") || "unknown";
    setProduct(productParam);

    // Redirect to new Success page for Blueprint purchases
    if (productParam === "prd-sow") {
      const stripeSessionId = params.get("session_id") || "";
      navigate(stripeSessionId ? `/success?session_id=${encodeURIComponent(stripeSessionId)}` : "/success");
      return;
    }

    // Pre-fill form with assessment data if available
    const stored = sessionStorage.getItem("assessmentResults");
    if (stored) {
      try {
        const results = JSON.parse(stored);
        const assessmentData = results.formData || {};
        
        setFormData((prev) => ({
          ...prev,
          email: assessmentData.email || "",
          name: assessmentData.name || "",
          company: assessmentData.company || "",
          context: `Assessment Results: ${results.fit}\nTrack: ${results.track}\nScore: ${results.score}`,
        }));
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
  }, []);

  const getSuccessMessage = (productType: string) => {
    switch (productType) {
      case "nocode":
        return {
          title: "Payment Received! 🎉",
          subtitle: "Your 3 Vetted No-Code Developer Matches",
          description:
            "Thank you for your purchase! We're preparing your personalized developer matches based on your assessment answers.",
          nextStep:
            "Complete the short intake form below so we can finalize your matches and schedule your Match Review call.",
        };
      case "prd-sow":
        return {
          title: "Blueprint Delivered! 📄",
          subtitle: "Your Full Hiring Blueprint",
          description:
            "Your 4 documents have been sent to your email.",
          nextStep:
            "Check your email for attachments in Word (.docx) or Markdown (.md).",
        };
      case "fullstack":
        return {
          title: "Welcome to the Waitlist! 📋",
          subtitle: "Full-Stack Priority Waitlist",
          description:
            "You've been added to our priority list for full-stack and agency developer matching. We'll contact you as soon as we launch this service.",
          nextStep:
            "Confirm your details below so we can reach you with the best options for your project.",
        };
      case "mobile":
        return {
          title: "Welcome to the Waitlist! 📋",
          subtitle: "Mobile Dev Priority Waitlist",
          description:
            "You've been added to our priority list for mobile developer matching. We'll contact you when we launch this service.",
          nextStep:
            "Confirm your details below so we can reach you with the best mobile development options.",
        };
      default:
        return {
          title: "Thank You!",
          subtitle: "Payment Successful",
          description: "Your payment has been processed successfully.",
          nextStep: "Please complete the form below.",
        };
    }
  };

  const message = getSuccessMessage(product);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitIntakeMutation.mutateAsync({
        email: formData.email,
        name: formData.name,
        company: formData.company,
        context: formData.context,
        productType: product === "nocode" ? "nocode-matches" : product === "fullstack" ? "fullstack-waitlist" : "mobile-waitlist",
      });

      if (result.success) {
        // Show success message and redirect
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit intake:", error);
      setSubmitError("Failed to submit your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 mb-8">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <button
            onClick={() => navigate("/")}
            className="text-slate-600 hover:text-slate-950 font-medium text-sm transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950 text-lg tracking-tight">
              THE FOUNDER LINK
            </span>
          </div>
          <div className="w-12" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{message.title}</h1>
          <h2 className="text-2xl text-gray-600 mb-6">{message.subtitle}</h2>
          <p className="text-lg text-gray-700 mb-8">{message.description}</p>
        </div>

        {/* Intake Form */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-12">
          <h3 className="text-2xl font-bold mb-2">Next Step</h3>
          <p className="text-gray-700 mb-8">{message.nextStep}</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Company / Project Name
              </label>
              <input
                type="text"
                placeholder="Your company or project"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Any additional context? (Optional)
              </label>
              <textarea
                placeholder="Tell us anything else we should know about your project..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-full font-bold text-lg"
            >
              {isSubmitting ? "Submitting..." : "Complete My Profile"}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              We'll review your information and reach out within 24 hours to confirm your matches or next steps.
            </p>
          </form>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">1. Profile Review</h4>
              <p className="text-gray-700">
                We review your intake form and assessment data to ensure we have everything we need.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">2. Match Preparation</h4>
              <p className="text-gray-700">
                Our team curates 3 developers (or confirms your waitlist status) based on your specific needs.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">3. Match Review Call</h4>
              <p className="text-gray-700">
                We schedule a 15-minute call to walk you through your matches and answer any questions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Have questions? Reach out to us at{" "}
            <a href="mailto:hello@thefounderlink.com" className="text-blue-600 hover:underline">
              hello@thefounderlink.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
