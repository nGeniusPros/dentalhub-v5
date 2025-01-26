import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { ViewDetailsModal } from "../../../../components/ViewDetailsModal";

interface CourseGridProps {
  onStartCourse: (courseId: string) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ onStartCourse }) => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const courses = [
    {
      id: "1",
      title: "HIPAA Compliance Essentials",
      description: "Learn the fundamentals of HIPAA compliance",
      progress: 75,
      points: 100,
      duration: "2 hours",
      category: "Compliance",
      required: true,
      dueDate: "2024-04-15",
      modules: [
        { title: "HIPAA Basics", duration: "30 min", completed: true },
        { title: "Patient Privacy", duration: "45 min", completed: true },
        { title: "Security Measures", duration: "45 min", completed: false },
      ],
    },
    {
      id: "2",
      title: "Advanced Patient Care",
      description: "Master the art of exceptional patient care",
      progress: 30,
      points: 150,
      duration: "3 hours",
      category: "Clinical",
      required: false,
    },
    {
      id: "3",
      title: "Leadership Skills",
      description: "Develop essential leadership capabilities",
      progress: 0,
      points: 200,
      duration: "4 hours",
      category: "Professional Development",
      required: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Your Learning Journey</h2>
        <Button variant="outline">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter Courses
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {course.description}
                </p>
              </div>
              {course.required && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Required
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <label className="text-gray-500">Points</label>
                  <p className="font-medium">{course.points}</p>
                </div>
                <div>
                  <label className="text-gray-500">Duration</label>
                  <p className="font-medium">{course.duration}</p>
                </div>
                <div>
                  <label className="text-gray-500">Category</label>
                  <p className="font-medium">{course.category}</p>
                </div>
              </div>

              {course.dueDate && (
                <p className="text-sm text-red-600">
                  Due by {new Date(course.dueDate).toLocaleDateString()}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCourse(course);
                  }}
                >
                  <Icons.Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => onStartCourse(course.id)}
                >
                  {course.progress === 0 ? (
                    <>
                      <Icons.Play
                        className="w-4 h-4 mr-2"
                        onClick={() => onStartCourse(course.id)}
                      />
                      Start Course
                    </>
                  ) : course.progress === 100 ? (
                    <>
                      <Icons.RotateCcw
                        className="w-4 h-4 mr-2"
                        onClick={() => onStartCourse(course.id)}
                      />
                      Retake Course
                    </>
                  ) : (
                    <>
                      <Icons.ArrowRight
                        className="w-4 h-4 mr-2"
                        onClick={() => onStartCourse(course.id)}
                      />
                      Continue
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ViewDetailsModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        data={selectedCourse}
        type="course"
        onAction={(action) => {
          if (action === "start-course") {
            onStartCourse(selectedCourse.id);
            setSelectedCourse(null);
          }
        }}
      />
    </motion.div>
  );
};
