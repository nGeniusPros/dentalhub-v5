import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";

export const PostPerformance = () => {
  const posts = [
    {
      id: "1",
      platform: "instagram",
      content: "Check out our latest smile makeover! 😁✨",
      date: "2024-03-10",
      likes: 245,
      comments: 32,
      shares: 15,
      reach: 2500,
      engagement: 4.8,
    },
    {
      id: "2",
      platform: "facebook",
      content: "New state-of-the-art equipment has arrived!",
      date: "2024-03-09",
      likes: 189,
      comments: 28,
      shares: 12,
      reach: 2100,
      engagement: 4.2,
    },
    {
      id: "3",
      platform: "twitter",
      content: "Tips for maintaining your oral health...",
      date: "2024-03-08",
      likes: 156,
      comments: 18,
      shares: 25,
      reach: 1800,
      engagement: 3.9,
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
          <h2 className="text-lg font-semibold">Post Performance</h2>
          <p className="text-sm text-gray-500">Recent post analytics</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {post.platform === "instagram" && (
                  <Icons.Instagram className="w-5 h-5 text-pink-500" />
                )}
                {post.platform === "facebook" && (
                  <Icons.Facebook className="w-5 h-5 text-blue-600" />
                )}
                {post.platform === "twitter" && (
                  <Icons.Twitter className="w-5 h-5 text-blue-400" />
                )}
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Icons.MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-gray-900 mb-4">{post.content}</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-500">Likes</p>
                <p className="font-medium">{post.likes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="font-medium">{post.comments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shares</p>
                <p className="font-medium">{post.shares}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reach</p>
                <p className="font-medium">{post.reach}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement</p>
                <p className="font-medium">{post.engagement}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
