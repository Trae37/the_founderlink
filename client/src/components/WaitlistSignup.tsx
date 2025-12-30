import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function WaitlistSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const waitlistMutation = trpc.intake.submitIntake.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await waitlistMutation.mutateAsync({
        email,
        name,
        company: "Personal",
        context: "results-page",
        productType: "fullstack-waitlist",
      });
      setIsSubmitted(true);
      setEmail("");
      setName("");
    } catch (error) {
      console.error("Waitlist signup error:", error);
      alert("Failed to join waitlist. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-neutral-900 mb-1">You're on the list!</h4>
        <p className="text-neutral-600 text-sm">We'll send updates when new hiring resources are available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-4 shadow-sm">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900 mb-1 tracking-tight">
            Get updates
          </h3>
          <p className="text-neutral-600 text-sm">
            Optional: join for future hiring resources and product updates.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="waitlist-name" className="block text-sm font-medium text-neutral-700 mb-2">
              Your Name
            </label>
            <input
              id="waitlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="waitlist-email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <Button
            type="submit"
            disabled={waitlistMutation.isPending}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-sm font-medium transition-colors"
          >
            {waitlistMutation.isPending ? "Joining..." : "Join"}
          </Button>
        </form>
      </div>
    </div>
  );
}
