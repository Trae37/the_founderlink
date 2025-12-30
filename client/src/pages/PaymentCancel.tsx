import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const [, navigate] = useLocation();

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
        {/* Cancel Message */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⏸️</div>
          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-xl text-gray-600 mb-8">
            No worries! Your payment wasn't processed. You can try again anytime.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-12">
          <h2 className="text-2xl font-bold mb-6">What's Next?</h2>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Try Again</h3>
              <p className="text-gray-700">
                Go back to your results and click the button again to complete your purchase.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700">
                If you're experiencing issues, reach out to us at{" "}
                <a href="mailto:hello@thefounderlink.com" className="text-blue-600 hover:underline">
                  hello@thefounderlink.com
                </a>
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Free Waitlist Option</h3>
              <p className="text-gray-700">
                Not ready to purchase? You can join our free waitlist for full-stack or mobile developer matching instead.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/results")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold text-lg"
            >
              Back to Results
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full py-4 rounded-full font-bold text-lg"
            >
              Return Home
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
          <div className="space-y-4">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Why was my payment cancelled?</h3>
              <p className="text-gray-700">
                You clicked the "back" or "cancel" button during checkout. Your card was not charged.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Will I be charged?</h3>
              <p className="text-gray-700">
                No. If you cancelled before completing payment, no charge will appear on your card.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Can I try a different payment method?</h3>
              <p className="text-gray-700">
                Yes! Go back to your results and try again. You can use a different card or payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-gray-600">
            Questions? Reach out to us at{" "}
            <a href="mailto:hello@thefounderlink.com" className="text-blue-600 hover:underline">
              hello@thefounderlink.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
