import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  required: boolean;
  dueDate?: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

export const LearningCenter = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'HIPAA Compliance Training',
      description: 'Annual required training on HIPAA regulations and compliance',
      category: 'Compliance',
      duration: '2 hours',
      required: true,
      dueDate: '2024-04-15',
      progress: 0,
      status: 'not-started'
    },
    {
      id: '2',
      title: 'Infection Control Protocols',
      description: 'Updated protocols for infection control and prevention',
      category: 'Clinical',
      duration: '1.5 hours',
      required: true,
      dueDate: '2024-03-30',
      progress: 75,
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Customer Service Excellence',
      description: 'Best practices for patient interaction and service',
      category: 'Soft Skills',
      duration: '3 hours',
      required: false,
      progress: 100,
      status: 'completed'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'clinical', name: 'Clinical' },
    { id: 'soft-skills', name: 'Soft Skills' },
    { id: 'technical', name: 'Technical' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Learning Center</h2>
          <p className="text-sm text-gray-500">Training and educational resources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  course.category === 'Compliance' && "bg-blue-100 text-blue-600",
                  course.category === 'Clinical' && "bg-green-100 text-green-600",
                  course.category === 'Soft Skills' && "bg-purple-100 text-purple-600"
                )}>
                  <Icons.BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.category}</p>
                </div>
              </div>
              {course.required && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Required
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{course.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Icons.Clock className="w-4 h-4" />
                {course.duration}
              </span>
              {course.dueDate && (
                <span className="flex items-center gap-1">
                  <Icons.Calendar className="w-4 h-4" />
                  Due: {course.dueDate}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    course.status === 'completed' && "bg-green-500",
                    course.status === 'in-progress' && "bg-blue-500",
                    course.status === 'not-started' && "bg-gray-300"
                  )}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{course.progress}% Complete</span>
                <span className="text-xs font-medium capitalize text-gray-700">
                  {course.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={course.status === 'completed'}
              >
                {course.status === 'not-started' ? (
                  <>
                    <Icons.Play className="w-4 h-4 mr-2" />
                    Start Course
                  </>
                ) : course.status === 'in-progress' ? (
                  <>
                    <Icons.ArrowRight className="w-4 h-4 mr-2" />
                    Continue
                  </>
                ) : (
                  <>
                    <Icons.CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Icons.Info className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};