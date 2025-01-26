import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export const LearningCenterIntegration = () => {
  const navigate = useNavigate();

  const learningStats = {
    assignedCourses: 3,
    completedCourses: 12,
    certificationsExpiringSoon: 2,
    availableCourses: 45,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Learning Center</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin-dashboard/learning")}
        >
          <Icons.ExternalLink className="w-4 h-4 mr-2" />
          Open
        </Button>
      </div>

      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icons.BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Assigned</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {learningStats.assignedCourses}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icons.CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {learningStats.completedCourses}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/admin-dashboard/learning/courses")}
          >
            <Icons.GraduationCap className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/admin-dashboard/learning/certifications")}
          >
            <Icons.Award className="w-4 h-4 mr-2" />
            Certifications
            {learningStats.certificationsExpiringSoon > 0 && (
              <span className="ml-auto px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {learningStats.certificationsExpiringSoon} expiring
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/admin-dashboard/learning/assignments")}
          >
            <Icons.ClipboardList className="w-4 h-4 mr-2" />
            Assignments
          </Button>
        </div>

        {/* Available Courses Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available Courses
          </h3>
          <div className="space-y-2">
            {[
              {
                title: "HIPAA Compliance",
                type: "Required",
                dueDate: "2024-04-15",
              },
              { title: "Customer Service", type: "Optional", progress: "75%" },
              {
                title: "Safety Training",
                type: "Required",
                dueDate: "2024-03-30",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() =>
                  navigate(`/admin-dashboard/learning/courses/${index + 1}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{course.title}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          course.type === "Required"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {course.type}
                      </span>
                      {course.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {course.dueDate}
                        </span>
                      )}
                      {course.progress && (
                        <span className="text-xs text-green-600">
                          Progress: {course.progress}
                        </span>
                      )}
                    </div>
                  </div>
                  <Icons.ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
