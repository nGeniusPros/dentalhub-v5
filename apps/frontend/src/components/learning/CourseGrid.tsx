import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Course } from '../../types/learning';
import { cn } from '../../lib/utils';

interface CourseCardProps {
  course: Course;
  onStartCourse: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onStartCourse }) => {
  const levelColors = {
    beginner: 'text-green-600 bg-green-50',
    intermediate: 'text-blue-600 bg-blue-50',
    advanced: 'text-purple-600 bg-purple-50'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {course.thumbnail ? (
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
          <Icons.BookOpen className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            levelColors[course.level]
          )}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          {course.required && (
            <span className="text-xs font-medium px-2 py-1 rounded-full text-red-600 bg-red-50">
              Required
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Icons.Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <Icons.Star className="w-4 h-4" />
            {course.points} points
          </div>
        </div>

        {course.status === 'in_progress' ? (
          <div className="space-y-2">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => onStartCourse(course.id)}
            className="w-full"
          >
            {course.status === 'completed' ? 'Review Course' : 'Start Course'}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

interface CourseGridProps {
  onStartCourse: (courseId: string) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ onStartCourse }) => {
  // This would typically come from an API or context
  const courses: Course[] = [
    {
      id: '1',
      title: 'HIPAA Compliance Fundamentals',
      description: 'Learn the essential principles of HIPAA compliance and patient privacy in dental practices.',
      category: 'compliance',
      level: 'beginner',
      duration: '2 hours',
      points: 100,
      progress: 0,
      modules: [],
      required: true,
      tags: ['HIPAA', 'Compliance', 'Privacy'],
      status: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Advanced Patient Care Techniques',
      description: 'Master advanced techniques for providing exceptional patient care in dental settings.',
      category: 'clinical',
      level: 'advanced',
      duration: '4 hours',
      points: 200,
      progress: 65,
      modules: [],
      required: false,
      tags: ['Patient Care', 'Clinical'],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Courses</h2>
        <Button variant="outline">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onStartCourse={onStartCourse}
          />
        ))}
      </div>
    </div>
  );
};
