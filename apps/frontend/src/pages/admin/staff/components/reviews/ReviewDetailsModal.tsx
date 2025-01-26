import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import type { Review } from "../PerformanceReviews";

interface ReviewDetailsModalProps {
  isOpen: boolean;
  review: Review | undefined;
  onClose: () => void;
  onUpdate: (updates: Partial<Review>) => void;
}

export const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
  isOpen,
  review,
  onClose,
  onUpdate,
}) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{review.employee}</h2>
              <p className="text-sm text-gray-500">{review.position}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Review Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      review.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : review.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {review.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Review Date</span>
                  <span>{review.reviewDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Review</span>
                  <span>{review.lastReview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex items-center gap-1">
                    <Icons.Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{review.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {review.feedback && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </h3>
                <p className="text-gray-600">{review.feedback}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {review.goals && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Goals
                </h3>
                <ul className="space-y-2">
                  {review.goals.map((goal, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.strengths && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {review.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icons.Plus className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {review.improvements && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {review.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Icons.ArrowUpRight className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {review.status !== "completed" && (
            <Button onClick={() => onUpdate({ status: "completed" })}>
              Mark as Completed
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
