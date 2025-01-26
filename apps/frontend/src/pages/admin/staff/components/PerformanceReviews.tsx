import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { ReviewDetailsModal } from "./reviews/ReviewDetailsModal";
import { CompleteReviewModal } from "./reviews/CompleteReviewModal";
import { ScheduleReviewModal } from "./reviews/ScheduleReviewModal";

interface Review {
  id: string;
  employee: string;
  position: string;
  reviewDate: string;
  status: "scheduled" | "completed" | "pending";
  lastReview: string;
  rating: number;
  feedback?: string;
  goals?: string[];
  strengths?: string[];
  improvements?: string[];
}

export const PerformanceReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      employee: "Dr. Sarah Wilson",
      position: "Lead Dentist",
      reviewDate: "2024-04-15",
      status: "scheduled",
      lastReview: "2023-10-15",
      rating: 4.8,
      goals: [
        "Increase patient satisfaction",
        "Complete advanced certification",
      ],
      strengths: ["Technical expertise", "Patient communication"],
      improvements: ["Time management"],
    },
    {
      id: "2",
      employee: "John Smith",
      position: "Dental Hygienist",
      reviewDate: "2024-03-20",
      status: "completed",
      lastReview: "2023-09-20",
      rating: 4.5,
      feedback: "Excellent performance in patient care and team collaboration.",
      goals: ["Maintain high cleaning standards", "Mentor junior staff"],
      strengths: ["Attention to detail", "Team player"],
      improvements: ["Documentation thoroughness"],
    },
    {
      id: "3",
      employee: "Emily Parker",
      position: "Front Desk",
      reviewDate: "2024-05-01",
      status: "pending",
      lastReview: "2023-11-01",
      rating: 4.2,
      goals: ["Improve scheduling efficiency", "Enhance customer service"],
      strengths: ["Organization skills", "Multi-tasking"],
      improvements: ["Follow-up communication"],
    },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState<string | null>(
    null,
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleScheduleReview = (newReview: Review) => {
    setReviews([...reviews, { ...newReview, id: Date.now().toString() }]);
    setShowScheduleModal(false);
  };

  const handleCompleteReview = (
    reviewId: string,
    completedReview: Partial<Review>,
  ) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, ...completedReview, status: "completed" }
          : review,
      ),
    );
    setShowCompleteModal(null);
  };

  const handleUpdateReview = (reviewId: string, updates: Partial<Review>) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, ...updates } : review,
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Performance Reviews</h2>
          <p className="text-sm text-gray-500">Upcoming and recent reviews</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowScheduleModal(true)}
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Schedule Review
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{review.employee}</p>
                <p className="text-sm text-gray-500">{review.position}</p>
              </div>
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

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Review Date</p>
                <p className="font-medium">{review.reviewDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Review</p>
                <p className="font-medium">{review.lastReview}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-1">
                  <Icons.Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{review.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetailsModal(review.id)}
              >
                <Icons.FileText className="w-4 h-4 mr-2" />
                View Details
              </Button>
              {review.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCompleteModal(review.id)}
                >
                  <Icons.Edit2 className="w-4 h-4 mr-2" />
                  Complete Review
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ReviewDetailsModal
        isOpen={!!showDetailsModal}
        review={reviews.find((r) => r.id === showDetailsModal)}
        onClose={() => setShowDetailsModal(null)}
        onUpdate={(updates) => {
          if (showDetailsModal) {
            handleUpdateReview(showDetailsModal, updates);
            setShowDetailsModal(null);
          }
        }}
      />

      <CompleteReviewModal
        isOpen={!!showCompleteModal}
        review={reviews.find((r) => r.id === showCompleteModal)}
        onClose={() => setShowCompleteModal(null)}
        onComplete={(completedReview) => {
          if (showCompleteModal) {
            handleCompleteReview(showCompleteModal, completedReview);
          }
        }}
      />

      <ScheduleReviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleReview}
      />
    </motion.div>
  );
};
