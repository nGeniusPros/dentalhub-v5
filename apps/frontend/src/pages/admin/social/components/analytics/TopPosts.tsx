import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";

export const TopPosts = () => {
  const posts = [
    {
      platform: "instagram",
      content: "Check out our latest smile makeover! 😁✨ #SmileTransformation",
      engagement: 1250,
      reach: 5000,
      date: "2024-03-10",
    },
    {
      platform: "facebook",
      content:
        "New state-of-the-art equipment has arrived! 🦷 #DentalTechnology",
      engagement: 980,
      reach: 4200,
      date: "2024-03-09",
    },
    {
      platform: "twitter",
      content: "5 Tips for maintaining your oral health between visits! 🦷✨",
      engagement: 750,
      reach: 3500,
      date: "2024-03-08",
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
          <h2 className="text-lg font-semibold">Top Performing Posts</h2>
          <p className="text-sm text-gray-500">Posts with highest engagement</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
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
                <Icons.ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-gray-900 mb-4">{post.content}</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Icons.Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {post.engagement.toLocaleString()} engagements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {post.reach.toLocaleString()} reach
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
