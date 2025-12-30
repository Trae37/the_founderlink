import { useEffect } from "react";
import { useLocation } from "wouter";

export default function TestResults() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Simulate quiz completion with COMPLEX MOBILE + AI project test data
    const testResult = {
      route: "custom",
      complexity: "complex",
      recommendation: "Your project requires custom development with advanced features and mobile capabilities.",
      reasoning: "Based on your requirements for mobile apps, AI features, real-time functionality, and payment processing, you need experienced full-stack developers who can handle complex architecture and integrations."
    };

    const testResponses = {
      1: "Have customer interviews (clear pain point)",
      2: "Marketplace (connecting buyers/sellers, service providers, freelancers)",
      3: "Web + Mobile",
      4: [
        "User authentication (login/signup)",
        "User profiles",
        "Messaging / chat",
        "Payments / subscriptions",
        "Search / discovery",
      ],
      5: [
        "Payments / subscriptions",
        "User authentication (login/signup)",
        "Real-time features (chat, notifications, live updates)",
        "Mobile app (native or PWA)",
      ],
      6: "Over $75,000",
      7: "ASAP (1-2 months)",
      8: "Custom code",
      9: "Somewhat comfortable (I can figure it out)",
      10: "First time",
      11: "Prefer overlap, but async is okay",
      12: "Two-sided marketplace connecting fitness coaches with clients. The core value is discovery + messaging + booking/payment. Users need profiles, can search/filter, message, and pay to book sessions.",
      13: "Success = 50 paying customers and 10 active coaches within 30 days.",
      14: ["Stripe (payments)", "Google Calendar", "Analytics (Mixpanel, Amplitude, etc.)"],
      15: { email: "test@example.com", first_name: "Test", last_name: "User" },
    };

    // Store in session storage (same as real quiz)
    sessionStorage.setItem("dev_test_seed", "1");
    sessionStorage.setItem("assessmentResult", JSON.stringify(testResult));
    sessionStorage.setItem("assessmentResponses", JSON.stringify(testResponses));
    sessionStorage.setItem("userEmail", "test@example.com");
    sessionStorage.setItem("userName", "Test User");

    // Redirect to results page
    navigate("/results");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F3F2EE] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-neutral-600">Setting up test data for complex mobile + AI project...</p>
      </div>
    </div>
  );
}
