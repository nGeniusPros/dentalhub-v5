import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";

export const LearningPathProgress = () => {
  const paths = [
    {
      id: "1",
      name: "Clinical Excellence",
      progress: 65,
      nextMilestone: "Advanced Patient Care",
      remainingCourses: 3,
      category: "Clinical",
      rewards: [
        { type: "badge", name: "Clinical Expert", unlocked: false },
        { type: "points", value: 1000, unlocked: false },
      ],
      milestones: [
        { name: "Basic Patient Care", completed: true },
        { name: "Intermediate Procedures", completed: true },
        { name: "Advanced Patient Care", completed: false },
        { name: "Specialization", completed: false },
      ],
    },
    {
      id: "2",
      name: "Leadership Development",
      progress: 40,
      nextMilestone: "Team Management",
      remainingCourses: 5,
      category: "Professional",
      rewards: [
        { type: "badge", name: "Leadership Star", unlocked: false },
        { type: "certificate", name: "Leadership Excellence", unlocked: false },
      ],
      milestones: [
        { name: "Communication Basics", completed: true },
        { name: "Team Management", completed: false },
        { name: "Conflict Resolution", completed: false },
        { name: "Strategic Planning", completed: false },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Learning Paths</h2>
          <p className="text-sm text-gray-500">
            Track your progress in different areas
          </p>
        </div>
        <Button variant="outline">
          <Icons.Plus className="w-4 h-4 mr-2" />
          Join New Path
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icons.Map className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{path.name}</h3>
                <p className="text-sm text-gray-500">{path.category}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{path.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                {path.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      milestone.completed ? "bg-green-50" : "bg-gray-100",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        milestone.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-400",
                      )}
                    >
                      {milestone.completed ? (
                        <Icons.Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        milestone.completed
                          ? "text-green-600"
                          : "text-gray-600",
                      )}
                    >
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rewards */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Path Rewards
                </h4>
                <div className="flex flex-wrap gap-2">
                  {path.rewards.map((reward, index) => (
                    <div
                      key={index}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                        reward.unlocked
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {reward.type === "badge" && (
                        <Icons.Award className="w-3 h-3" />
                      )}
                      {reward.type === "points" && (
                        <Icons.Star className="w-3 h-3" />
                      )}
                      {reward.type === "certificate" && (
                        <Icons.FileCheck className="w-3 h-3" />
                      )}
                      {reward.type === "points"
                        ? `${reward.value} Points`
                        : reward.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Icons.BookOpen className="w-4 h-4 text-primary" />
                  <span>{path.remainingCourses} courses remaining</span>
                </div>
                <Button>Continue Path</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
