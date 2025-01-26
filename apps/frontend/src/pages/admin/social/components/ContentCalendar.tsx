import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const ContentCalendar = () => {
  const scheduledPosts = [
    {
      id: "1",
      platform: "instagram",
      content: "Before & After: Amazing smile transformation!",
      scheduledDate: "2024-03-15 10:00",
      status: "scheduled",
      type: "image",
    },
    {
      id: "2",
      platform: "facebook",
      content: "Meet our newest team member...",
      scheduledDate: "2024-03-16 14:30",
      status: "draft",
      type: "video",
    },
    {
      id: "3",
      platform: "twitter",
      content: "5 Tips for a Healthy Smile",
      scheduledDate: "2024-03-17 09:00",
      status: "scheduled",
      type: "text",
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
          <h2 className="text-lg font-semibold">Content Calendar</h2>
          <p className="text-sm text-gray-500">Upcoming scheduled posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button size="sm">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {scheduledPosts.map((post) => (
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
                <span className="text-sm text-gray-500">
                  {post.scheduledDate}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.status === "scheduled"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Icons.Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            <p className="text-gray-900 mb-3">{post.content}</p>

            <div className="flex items-center gap-2">
              {post.type === "image" && (
                <Icons.Image className="w-4 h-4 text-gray-500" />
              )}
              {post.type === "video" && (
                <Icons.Video className="w-4 h-4 text-gray-500" />
              )}
              {post.type === "text" && (
                <Icons.FileText className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-500 capitalize">
                {post.type} Post
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
