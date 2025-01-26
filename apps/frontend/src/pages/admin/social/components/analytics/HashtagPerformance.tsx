import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../../../components/ui/button";
import * as Icons from "lucide-react";

export const HashtagPerformance = () => {
  const data = [
    {
      hashtag: "#SmileTransformation",
      posts: 45,
      engagement: 2500,
      reach: 12000,
    },
    { hashtag: "#DentalCare", posts: 38, engagement: 1800, reach: 9500 },
    { hashtag: "#OralHealth", posts: 32, engagement: 1500, reach: 8000 },
    { hashtag: "#DentalTips", posts: 28, engagement: 1200, reach: 7000 },
    { hashtag: "#HealthySmile", posts: 25, engagement: 1000, reach: 6000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Hashtag Performance</h2>
          <p className="text-sm text-gray-500">Top performing hashtags</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(203, 213, 225, 0.3)"
            />
            <XAxis dataKey="hashtag" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="engagement" fill="#4BC5BD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Icons.Hash className="w-4 h-4 text-primary" />
              <span className="font-medium">{item.hashtag}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{item.posts} posts</span>
              <span className="text-sm text-gray-500">
                {item.reach.toLocaleString()} reach
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
