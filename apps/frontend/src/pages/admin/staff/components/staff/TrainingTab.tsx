import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../../../contexts/NotificationContext";
import { AddTrainingModal } from "./AddTrainingModal";

export const TrainingTab = () => {
  const [showAddTraining, setShowAddTraining] = useState(false);
  const navigate = useNavigate();
  const { dispatch: notifyDispatch } = useNotifications();

  const trainingModules = [
    {
      id: "1",
      title: "HIPAA Compliance",
      description: "Annual HIPAA compliance training",
      type: "compliance",
      status: "required",
      dueDate: "2024-04-15",
      progress: 75,
      assignedTo: [
        { name: "Dr. Sarah Wilson", completed: true },
        { name: "Dr. Michael Chen", completed: false },
      ],
    },
    {
      id: "2",
      title: "Patient Care Excellence",
      description: "Advanced patient care techniques",
      type: "clinical",
      status: "optional",
      dueDate: "2024-03-30",
      progress: 50,
      assignedTo: [
        { name: "Dr. Sarah Wilson", completed: false },
        { name: "Dr. Michael Chen", completed: true },
      ],
    },
    {
      id: "3",
      title: "Emergency Procedures",
      description: "Updated emergency response protocols",
      type: "safety",
      status: "required",
      dueDate: "2024-03-20",
      progress: 90,
      assignedTo: [
        { name: "Dr. Sarah Wilson", completed: true },
        { name: "Dr. Michael Chen", completed: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Training Management</h2>
          <p className="text-sm text-gray-500">
            Manage staff training and certifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowAddTraining(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Training
          </Button>
        </div>
      </div>

      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold">85%</p>
          <p className="text-sm text-gray-500">Overall training completion</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.Clock className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Upcoming Due</h3>
          </div>
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-gray-500">Trainings due this month</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.Award className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Certifications</h3>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Active certifications</p>
        </div>
      </div>

      {/* Training Modules */}
      <div className="space-y-4">
        {trainingModules.map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    module.type === "compliance" && "bg-blue-100 text-blue-600",
                    module.type === "clinical" && "bg-green-100 text-green-600",
                    module.type === "safety" && "bg-red-100 text-red-600",
                  )}
                >
                  <Icons.BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </div>
              <span
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  module.status === "required"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800",
                )}
              >
                {module.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{module.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icons.Calendar className="w-4 h-4 text-gray-400" />
                  <span>Due: {module.dueDate}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    {module.assignedTo.filter((a) => a.completed).length} of{" "}
                    {module.assignedTo.length} completed
                  </span>
                  <div className="flex -space-x-2">
                    {module.assignedTo.map((person, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center",
                          person.completed ? "bg-green-100" : "bg-gray-100",
                        )}
                      >
                        {person.completed ? (
                          <Icons.Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icons.Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Icons.Users className="w-4 h-4 mr-2" />
                  Assign Staff
                </Button>
                <Button variant="outline" className="flex-1">
                  <Icons.FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button className="flex-1">
                  <Icons.Play className="w-4 h-4 mr-2" />
                  Start Training
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AddTrainingModal
        isOpen={showAddTraining}
        onClose={() => setShowAddTraining(false)}
        onAdd={(training) => {
          // Handle adding new training
          console.log("New training:", training);

          notifyDispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              type: "message",
              title: "Training Added",
              message: `${training.title} has been added successfully`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: "medium",
            },
          });

          // Navigate to learning center if specified
          if (training.redirectToLearning) {
            navigate("/admin-dashboard/learning");
          }
        }}
      />
    </div>
  );
};
