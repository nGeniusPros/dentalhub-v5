import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import type { TimeOffRequest } from "../../../../types/timeOff";
import { useNotifications } from "../../../../contexts/NotificationContext";
import { TimeOffRequestForm } from "./timeoff/TimeOffRequestForm";

export const TimeOffRequests = () => {
  const { dispatch: notifyDispatch } = useNotifications();
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const [requests, setRequests] = React.useState<TimeOffRequest[]>([
    {
      id: "1",
      employeeId: "1",
      type: "vacation",
      startDate: "2024-04-15",
      endDate: "2024-04-22",
      reason: "Family vacation",
      status: "pending",
      submittedDate: "2024-03-10",
    },
    {
      id: "2",
      employeeId: "2",
      type: "sick",
      startDate: "2024-03-20",
      endDate: "2024-03-21",
      reason: "Doctor appointment",
      status: "approved",
      submittedDate: "2024-03-08",
    },
    {
      id: "3",
      employeeId: "3",
      type: "personal",
      startDate: "2024-04-01",
      endDate: "2024-04-02",
      reason: "Personal matters",
      status: "pending",
      submittedDate: "2024-03-09",
    },
  ]);

  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "approved" } : request,
      ),
    );

    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Time Off Request Approved",
        message: "The time off request has been approved.",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  const handleDeny = (requestId: string) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "denied" } : request,
      ),
    );

    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Time Off Request Denied",
        message: "The time off request has been denied.",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  const handleNewRequest = (request: Partial<TimeOffRequest>) => {
    const newRequest: TimeOffRequest = {
      id: Date.now().toString(),
      employeeId: "1", // In production, this would come from the logged-in user
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      ...request,
    };

    setRequests([newRequest, ...requests]);
    setShowRequestForm(false);

    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Time Off Request Submitted",
        message: "Your time off request has been submitted for approval.",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Time Off Requests</h2>
          <p className="text-sm text-gray-500">Pending and recent requests</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRequestForm(true)}
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">Dr. Sarah Wilson</p>
                <p className="text-sm text-gray-500">{request.type}</p>
              </div>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800",
                )}
              >
                {request.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Icons.Calendar className="w-4 h-4" />
                {request.startDate} - {request.endDate}
              </div>
              <div className="flex items-center gap-1">
                <Icons.Clock className="w-4 h-4" />
                Submitted: {request.submittedDate}
              </div>
            </div>

            {request.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="w-24"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-24"
                  onClick={() => handleDeny(request.id)}
                >
                  Deny
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <TimeOffRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleNewRequest}
      />
    </motion.div>
  );
};
