import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function AdminMatches() {
  const [, navigate] = useLocation();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getSubmissionsQuery = trpc.intake.getSubmissions.useQuery();
  const getDevelopersQuery = trpc.matches.getDevelopers.useQuery();
  const assignMatchesMutation = trpc.matches.assignMatches.useMutation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [submissionsData, developersData] = await Promise.all([
          getSubmissionsQuery.refetch(),
          getDevelopersQuery.refetch(),
        ]);

        if (submissionsData.data) {
          setSubmissions(submissionsData.data);
        }
        if (developersData.data) {
          setDevelopers(developersData.data);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setMessage({ type: "error", text: "Failed to load data" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleDeveloper = (devId: number) => {
    setSelectedDevelopers((prev) =>
      prev.includes(devId) ? prev.filter((id) => id !== devId) : [...prev, devId]
    );
  };

  const handleAssignMatches = async () => {
    if (!selectedSubmission || selectedDevelopers.length === 0) {
      setMessage({ type: "error", text: "Please select a submission and at least one developer" });
      return;
    }

    setIsAssigning(true);
    try {
      const result = await assignMatchesMutation.mutateAsync({
        intakeSubmissionId: selectedSubmission,
        developerIds: selectedDevelopers,
      });

      setMessage({ type: "success", text: result.message });
      setSelectedDevelopers([]);
      setSelectedSubmission(null);

      // Refresh data
      const submissionsData = await getSubmissionsQuery.refetch();
      if (submissionsData.data) {
        setSubmissions(submissionsData.data);
      }
    } catch (err) {
      console.error("Failed to assign matches:", err);
      setMessage({ type: "error", text: "Failed to assign matches" });
    } finally {
      setIsAssigning(false);
    }
  };

  const selectedSubmissionData = submissions.find((s) => s.id === selectedSubmission);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assign Matches</h1>
              <p className="text-gray-600 mt-1">Match developers to customer intake submissions</p>
            </div>
            <Button onClick={() => navigate("/admin")} variant="outline" className="px-6 py-2">
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Customer</h2>

            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : submissions.length === 0 ? (
              <p className="text-gray-600">No submissions found</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {submissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedSubmission === submission.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{submission.name}</div>
                    <div className="text-sm text-gray-600">{submission.company}</div>
                    <div className="text-sm text-gray-500">{submission.email}</div>
                    <div className="text-xs mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded ${
                          submission.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.paymentStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Developers Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Developers</h2>

            {!selectedSubmission ? (
              <p className="text-gray-600">Select a customer first</p>
            ) : isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : developers.length === 0 ? (
              <p className="text-gray-600">No developers found</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {developers.map((dev) => (
                  <label
                    key={dev.id}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDevelopers.includes(dev.id)}
                      onChange={() => handleToggleDeveloper(dev.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{dev.name}</div>
                      <div className="text-sm text-gray-600">{dev.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dev.specialization} • {dev.yearsExperience || 0} years
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Summary and Action */}
        {selectedSubmission && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment Summary</h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">{selectedSubmissionData?.name}</p>
                <p className="text-sm text-gray-600">{selectedSubmissionData?.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Developers Selected</p>
                <p className="font-semibold text-gray-900">{selectedDevelopers.length}</p>
                {selectedDevelopers.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    {selectedDevelopers.map((devId) => {
                      const dev = developers.find((d) => d.id === devId);
                      return <div key={devId}>{dev?.name}</div>;
                    })}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleAssignMatches}
              disabled={isAssigning || selectedDevelopers.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold"
            >
              {isAssigning ? "Assigning..." : `Assign ${selectedDevelopers.length} Match${selectedDevelopers.length !== 1 ? "es" : ""}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
