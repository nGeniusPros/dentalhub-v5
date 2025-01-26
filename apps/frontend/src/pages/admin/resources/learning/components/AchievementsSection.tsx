import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export const AchievementsSection = () => {
  const navigate = useNavigate();
  const achievements = [
    {
      id: "1",
      title: "Fast Learner",
      description: "Complete 5 courses in one month",
      icon: "Zap",
      progress: 3,
      target: 5,
      points: 250,
      unlocked: false,
    },
    {
      id: "2",
      title: "Perfect Score",
      description: "Score 100% on any assessment",
      icon: "Target",
      progress: 1,
      target: 1,
      points: 500,
      unlocked: true,
    },
    {
      id: "3",
      title: "Team Player",
      description: "Complete 3 team challenges",
      icon: "Users",
      progress: 2,
      target: 3,
      points: 300,
      unlocked: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin-dashboard/learning/achievements")}
        >
          <Icons.Award className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => {
          const Icon = Icons[achievement.icon as keyof typeof Icons];
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlocked ? "bg-primary/5" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    achievement.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Icons.Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {achievement.points}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">
                          Progress: {achievement.progress}/{achievement.target}
                        </span>
                        <span className="font-medium">
                          {Math.round(
                            (achievement.progress / achievement.target) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{
                            width: `${(achievement.progress / achievement.target) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
