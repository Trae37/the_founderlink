import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  Users, Mail, DollarSign, ListChecks, FileText, MessageSquare, 
  Home, TrendingUp, Calendar, CheckCircle, XCircle, Clock 
} from "lucide-react";

type TabType = "overview" | "signups" | "conversions" | "waitlist" | "templates" | "feedback";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSubmissionsQuery = trpc.intake.getSubmissions.useQuery();
  const { data: assessments } = trpc.assessment.getAll.useQuery();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getSubmissionsQuery.refetch();
        if (data.data) {
          setSubmissions(data.data);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const stats = {
    totalSignups: assessments?.length || 0,
    blueprintPurchases: submissions.filter(s => 
      s.productType === "prd-sow-tripwire" && s.paymentStatus === "completed"
    ).length,
    waitlistSignups: submissions.filter(s => 
      s.productType === "fullstack-waitlist" || s.productType === "mobile-waitlist"
    ).length,
    conversionRate: (assessments?.length || 0) > 0 
      ? ((submissions.filter(s => s.productType === "prd-sow-tripwire" && s.paymentStatus === "completed").length / (assessments?.length || 1)) * 100).toFixed(1)
      : "0.0",
  };

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

      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#d4d4d0] bg-[#F3F2EE]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black flex items-center justify-center rounded-sm">
              <span className="text-white font-mono font-medium text-xs">F</span>
            </div>
            <span className="font-medium tracking-tight text-sm text-neutral-800">Admin Dashboard</span>
          </div>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#d4d4d0] rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Email Signups</span>
              <Mail className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-medium text-neutral-900">{stats.totalSignups}</p>
          </div>

          <div className="bg-white border border-amber-300 rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-700 uppercase tracking-wider">$149 Blueprints</span>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-medium text-neutral-900">{stats.blueprintPurchases}</p>
          </div>

          <div className="bg-white border border-[#d4d4d0] rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Waitlist</span>
              <Users className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-medium text-neutral-900">{stats.waitlistSignups}</p>
          </div>

          <div className="bg-white border border-green-300 rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-green-700 uppercase tracking-wider">Conversion</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-medium text-neutral-900">{stats.conversionRate}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm shadow-sm mb-6">
          <div className="flex border-b border-[#d4d4d0] overflow-x-auto">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<TrendingUp className="w-4 h-4" />}
              label="Overview"
            />
            <TabButton
              active={activeTab === "signups"}
              onClick={() => setActiveTab("signups")}
              icon={<Mail className="w-4 h-4" />}
              label="Email Signups"
            />
            <TabButton
              active={activeTab === "conversions"}
              onClick={() => setActiveTab("conversions")}
              icon={<DollarSign className="w-4 h-4" />}
              label="$149 Conversions"
            />
            <TabButton
              active={activeTab === "waitlist"}
              onClick={() => setActiveTab("waitlist")}
              icon={<ListChecks className="w-4 h-4" />}
              label="Waitlist"
            />
            <TabButton
              active={activeTab === "templates"}
              onClick={() => setActiveTab("templates")}
              icon={<FileText className="w-4 h-4" />}
              label="Templates"
            />
            <TabButton
              active={activeTab === "feedback"}
              onClick={() => setActiveTab("feedback")}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Feedback"
            />
          </div>

          <div className="p-6">
            {activeTab === "overview" && <OverviewTab stats={stats} />}
            {activeTab === "signups" && <SignupsTab />}
            {activeTab === "conversions" && <ConversionsTab submissions={submissions.filter(s => s.productType === "prd-sow-tripwire")} isLoading={isLoading} />}
            {activeTab === "waitlist" && <WaitlistTab submissions={submissions.filter(s => s.productType === "fullstack-waitlist" || s.productType === "mobile-waitlist")} isLoading={isLoading} />}
            {activeTab === "templates" && <TemplatesTab />}
            {activeTab === "feedback" && <FeedbackTab />}
          </div>
        </div>


      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "text-neutral-900 border-b-2 border-amber-500 bg-amber-50"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      {/* Website Traffic Analytics Note */}
      <div className="border border-blue-200 rounded-sm p-4 bg-blue-50">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-700 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-1">Website Traffic Analytics</h3>
            <p className="text-xs text-neutral-700">
              Page views and visitor data are tracked automatically. View detailed analytics through the Manus platform dashboard.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium text-neutral-900 mb-4">Conversion Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Email Signups</span>
            </div>
            <p className="text-2xl font-medium text-neutral-900 mb-1">{stats.totalSignups}</p>
            <p className="text-sm text-neutral-600">Total assessments completed</p>
          </div>

          <div className="border border-amber-300 rounded-sm p-4 bg-amber-50">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-amber-700" />
              <span className="font-medium text-neutral-900">Blueprint Sales</span>
            </div>
            <p className="text-2xl font-medium text-neutral-900 mb-1">{stats.blueprintPurchases}</p>
            <p className="text-sm text-neutral-700">$149 Full Blueprint purchases</p>
          </div>

          <div className="border border-neutral-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Waitlist</span>
            </div>
            <p className="text-2xl font-medium text-neutral-900 mb-1">{stats.waitlistSignups}</p>
            <p className="text-sm text-neutral-600">Developer matching waitlist</p>
          </div>

          <div className="border border-green-300 rounded-sm p-4 bg-green-50">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-700" />
              <span className="font-medium text-neutral-900">Conversion Rate</span>
            </div>
            <p className="text-2xl font-medium text-neutral-900 mb-1">{stats.conversionRate}%</p>
            <p className="text-sm text-neutral-700">Signup to $149 purchase</p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Recent Activity</h3>
        <p className="text-neutral-600 text-sm">Switch to specific tabs above to view detailed data for each category.</p>
      </div>
    </div>
  );
}

function SignupsTab() {
  const { data: assessments = [], isLoading } = trpc.assessment.getAll.useQuery();
  if (isLoading) {
    return <div className="text-center py-12 text-neutral-600">Loading signups...</div>;
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600">No email signups yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Email</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Route</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Date</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {assessments.map((assessment, idx) => (
            <tr key={idx} className="hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm text-neutral-900">{assessment.email}</td>
              <td className="px-4 py-3 text-sm text-neutral-900">{assessment.name || "-"}</td>
              <td className="px-4 py-3 text-sm text-neutral-600">{assessment.route}</td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {new Date(assessment.completedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-sm text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConversionsTab({ submissions, isLoading }: { submissions: any[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-12 text-neutral-600">Loading conversions...</div>;
  }

  const completedPurchases = submissions.filter(s => s.paymentStatus === "completed");

  if (completedPurchases.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600">No $149 Blueprint purchases yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Email</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Date</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {completedPurchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm text-neutral-900">{purchase.email}</td>
              <td className="px-4 py-3 text-sm text-neutral-900">{purchase.name}</td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {new Date(purchase.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-sm text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Paid
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WaitlistTab({ submissions, isLoading }: { submissions: any[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-12 text-neutral-600">Loading waitlist...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <ListChecks className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600">No waitlist signups yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Email</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Type</th>
            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-600">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {submissions.map((submission) => (
            <tr key={submission.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm text-neutral-900">{submission.email}</td>
              <td className="px-4 py-3 text-sm text-neutral-900">{submission.name}</td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {submission.productType === "fullstack-waitlist" ? "Full-Stack" : "Mobile"}
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {new Date(submission.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TemplatesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-neutral-900 mb-2">Blueprint Document Templates</h3>
        <p className="text-neutral-600 text-sm mb-6">Manage document templates for different routes (no-code, hybrid, custom)</p>
      </div>

      <div className="border border-amber-300 bg-amber-50 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900 mb-1">Template Editor Coming Soon</p>
            <p className="text-sm text-neutral-700">
              Template management interface will allow you to edit blueprint document templates for each route. 
              Currently, templates are managed in the codebase at <code className="bg-white px-1 py-0.5 rounded text-xs">server/services/prd-generator.ts</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-neutral-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-900">No-Code Route</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-sm">Active</span>
          </div>
          <p className="text-xs text-neutral-600 mb-2">Blueprint document templates</p>
          <p className="text-xs text-neutral-500">Last updated: System default</p>
        </div>

        <div className="border border-neutral-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-900">Hybrid Route</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-sm">Active</span>
          </div>
          <p className="text-xs text-neutral-600 mb-2">Blueprint document templates</p>
          <p className="text-xs text-neutral-500">Last updated: System default</p>
        </div>

        <div className="border border-neutral-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-900">Custom Route</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-sm">Active</span>
          </div>
          <p className="text-xs text-neutral-600 mb-2">Blueprint document templates</p>
          <p className="text-xs text-neutral-500">Last updated: System default</p>
        </div>
      </div>
    </div>
  );
}

function FeedbackTab() {
  const { data: feedback, isLoading, refetch } = trpc.feedback.getAll.useQuery();
  const updateStatus = trpc.feedback.updateStatus.useMutation();
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [response, setResponse] = useState("");
  const respondMutation = trpc.feedback.respond.useMutation();

  const handleRespond = async (id: number) => {
    if (!response.trim()) return;

    try {
      await respondMutation.mutateAsync({ id, response: response.trim() });
      setRespondingTo(null);
      setResponse("");
      refetch();
    } catch (error) {
      console.error("Failed to respond:", error);
      alert("Failed to send response");
    }
  };

  const handleStatusChange = async (id: number, status: "new" | "in-progress" | "resolved" | "closed") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-neutral-600">Loading feedback...</div>;
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600 mb-4">No feedback submissions yet</p>
        <p className="text-sm text-neutral-500">Users can submit feedback via the feedback widget on your site</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div key={item.id} className="border border-neutral-200 rounded-sm p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-neutral-900">{item.name || item.email}</span>
                <span className={`px-2 py-1 text-xs rounded-sm ${
                  item.category === "bug" ? "bg-red-100 text-red-800" :
                  item.category === "feature" ? "bg-blue-100 text-blue-800" :
                  item.category === "question" ? "bg-purple-100 text-purple-800" :
                  "bg-neutral-100 text-neutral-800"
                }`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-1">{item.email}</p>
            </div>
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
              className="px-2 py-1 text-xs border border-neutral-300 rounded-sm"
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <p className="text-neutral-900 text-sm mb-3 whitespace-pre-wrap">{item.message}</p>

          {item.adminResponse && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-3">
              <p className="text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">Your Response</p>
              <p className="text-sm text-neutral-900 whitespace-pre-wrap">{item.adminResponse}</p>
              <p className="text-xs text-neutral-500 mt-2">
                Responded: {item.respondedAt ? new Date(item.respondedAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          )}

          {respondingTo === item.id ? (
            <div className="space-y-2">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond(item.id)}
                  className="px-3 py-1 bg-black text-white rounded-sm text-sm hover:bg-neutral-800"
                >
                  Send Response
                </button>
                <button
                  onClick={() => {
                    setRespondingTo(null);
                    setResponse("");
                  }}
                  className="px-3 py-1 border border-neutral-300 rounded-sm text-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setRespondingTo(item.id)}
              className="text-sm text-amber-700 hover:text-amber-800 font-medium"
            >
              {item.adminResponse ? "Update Response" : "Respond"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
