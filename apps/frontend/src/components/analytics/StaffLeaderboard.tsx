import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

export const StaffLeaderboard = () => {
  const leaderboardData = [
    { name: "Dr. Sarah Wilson", points: 1250, badges: 8, rank: 1 },
    { name: "Dr. Michael Chen", points: 1150, badges: 7, rank: 2 },
    { name: "Dr. Emily Parker", points: 1050, badges: 6, rank: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Staff Leaderboard</h2>
        <Button variant="outline" size="sm">
          <Icons.Trophy className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((staff, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-600"
                    : index === 1
                      ? "bg-gray-100 text-gray-600"
                      : "bg-orange-100 text-orange-600"
                }`}
              >
                {staff.rank}
              </div>
              <div>
                <p className="font-medium text-gray-900">{staff.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Icons.Award className="w-4 h-4" />
                  {staff.badges} badges
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{staff.points}</p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
