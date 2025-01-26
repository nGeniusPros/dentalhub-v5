import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";

interface AssignmentCardProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "pending" | "in_progress" | "submitted" | "graded";
    grade?: number;
    feedback?: string;
    type: "quiz" | "assessment" | "project";
    points: number;
    timeEstimate: string;
    attachments?: Array<{
      name: string;
      type: string;
      size: string;
    }>;
  };
  onStart: (id: string) => void;
  onView: (id: string) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onStart,
  onView,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              assignment.type === "quiz" && "bg-blue-100",
              assignment.type === "assessment" && "bg-purple-100",
              assignment.type === "project" && "bg-green-100",
            )}
          >
            {assignment.type === "quiz" && (
              <Icons.FileQuestion className="w-5 h-5 text-blue-600" />
            )}
            {assignment.type === "assessment" && (
              <Icons.ClipboardCheck className="w-5 h-5 text-purple-600" />
            )}
            {assignment.type === "project" && (
              <Icons.FolderKanban className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
            <p className="text-sm text-gray-500">
              {assignment.type.charAt(0).toUpperCase() +
                assignment.type.slice(1)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full",
            assignment.status === "pending" && "bg-yellow-100 text-yellow-800",
            assignment.status === "in_progress" && "bg-blue-100 text-blue-800",
            assignment.status === "submitted" &&
              "bg-purple-100 text-purple-800",
            assignment.status === "graded" && "bg-green-100 text-green-800",
          )}
        >
          {assignment.status.replace("_", " ").charAt(0).toUpperCase() +
            assignment.status.replace("_", " ").slice(1)}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <label className="text-gray-500">Due Date</label>
          <p className="font-medium">
            {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <label className="text-gray-500">Points</label>
          <p className="font-medium">{assignment.points}</p>
        </div>
        <div>
          <label className="text-gray-500">Time</label>
          <p className="font-medium">{assignment.timeEstimate}</p>
        </div>
      </div>

      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-2">
            Attachments
          </label>
          <div className="space-y-2">
            {assignment.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <Icons.FileText className="w-4 h-4 text-gray-400" />
                  <span>{file.name}</span>
                </div>
                <span className="text-gray-500">{file.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {assignment.status === "graded" && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Grade</span>
            <span className="text-lg font-bold text-primary">
              {assignment.grade}%
            </span>
          </div>
          {assignment.feedback && (
            <p className="text-sm text-gray-600">{assignment.feedback}</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {assignment.status === "pending" && (
          <Button className="flex-1" onClick={() => onStart(assignment.id)}>
            <Icons.Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        )}
        {assignment.status === "in_progress" && (
          <Button className="flex-1" onClick={() => onStart(assignment.id)}>
            <Icons.ArrowRight className="w-4 h-4 mr-2" />
            Continue
          </Button>
        )}
        {(assignment.status === "submitted" ||
          assignment.status === "graded") && (
          <Button className="flex-1" onClick={() => onView(assignment.id)}>
            <Icons.Eye className="w-4 h-4 mr-2" />
            View Submission
          </Button>
        )}
      </div>
    </motion.div>
  );
};
