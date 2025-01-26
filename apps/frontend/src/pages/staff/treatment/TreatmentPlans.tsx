import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useNotifications } from "../../../contexts/NotificationContext";

interface TreatmentPlan {
  id: string;
  patientName: string;
  diagnosis: string;
  procedures: {
    name: string;
    status: "pending" | "completed" | "scheduled";
    estimatedCost: number;
    scheduledDate?: string;
  }[];
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "on-hold";
  totalCost: number;
}

export const TreatmentPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { dispatch: notifyDispatch } = useNotifications();

  const [plans] = useState<TreatmentPlan[]>([
    {
      id: "1",
      patientName: "John Smith",
      diagnosis: "Multiple cavities and gum disease",
      procedures: [
        {
          name: "Deep Cleaning",
          status: "completed",
          estimatedCost: 200,
          scheduledDate: "2025-01-15",
        },
        {
          name: "Cavity Filling (3)",
          status: "scheduled",
          estimatedCost: 450,
          scheduledDate: "2025-02-01",
        },
        {
          name: "Root Canal",
          status: "pending",
          estimatedCost: 800,
        },
      ],
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      status: "active",
      totalCost: 1450,
    },
  ]);

  const handleCreatePlan = () => {
    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "info",
        title: "New Treatment Plan",
        message: "Opening treatment plan creator...",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Treatment Plans
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track patient treatment plans
          </p>
        </div>
        <Button onClick={handleCreatePlan}>
          <Icons.FilePlus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Plan Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { id: "active", label: "Active Plans" },
            { id: "completed", label: "Completed" },
            { id: "on-hold", label: "On Hold" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-md ${
                activeTab === id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment Plans List */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.patientName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.diagnosis}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : plan.status === "completed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Icons.MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Start Date: {plan.startDate}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    End Date: {plan.endDate}
                  </span>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold mb-2">Procedures</h4>
                  <div className="space-y-2">
                    {plan.procedures.map((procedure, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <div>
                          <p className="font-medium">{procedure.name}</p>
                          {procedure.scheduledDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Scheduled: {procedure.scheduledDate}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">
                            ${procedure.estimatedCost}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              procedure.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : procedure.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            }`}
                          >
                            {procedure.status.charAt(0).toUpperCase() +
                              procedure.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total Estimated Cost</span>
                  <span className="text-lg font-bold">${plan.totalCost}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
