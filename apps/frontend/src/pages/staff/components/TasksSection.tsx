import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
}

export const TasksSection: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: "1",
      title: "Review Patient Records",
      description:
        "Review and update treatment plans for upcoming appointments",
      priority: "high",
      dueDate: "Today",
      completed: false,
    },
    {
      id: "2",
      title: "Follow-up Calls",
      description: "Call patients who had procedures last week",
      priority: "medium",
      dueDate: "Tomorrow",
      completed: false,
    },
    {
      id: "3",
      title: "Update Inventory",
      description: "Check and update dental supplies inventory",
      priority: "low",
      dueDate: "Next Week",
      completed: true,
    },
  ]);

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Tasks</CardTitle>
        <Button variant="outline" size="sm">
          <Icons.Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start space-x-4 p-3 rounded-lg",
                "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                task.completed && "opacity-60",
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleTaskToggle(task.id)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900 dark:text-white",
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        getPriorityColor(task.priority),
                        "bg-opacity-10",
                      )}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-600 dark:text-gray-300",
                  )}
                >
                  {task.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
