import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review patient records",
      assignee: "Dr. Sarah Wilson",
      dueDate: "2024-03-15",
      priority: "high",
      status: "pending",
    },
    {
      id: "2",
      title: "Update treatment plans",
      assignee: "Dr. Michael Chen",
      dueDate: "2024-03-16",
      priority: "medium",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Follow-up calls",
      assignee: "Emily Parker",
      dueDate: "2024-03-17",
      priority: "low",
      status: "completed",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Task Manager</h2>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  <Icons.Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignee}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Icons.Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Icons.Calendar className="w-4 h-4" />
              Due: {task.dueDate}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
