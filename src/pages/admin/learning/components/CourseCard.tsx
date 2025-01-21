import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    progress: number;
    points: number;
    duration: string;
    category: string;
    required: boolean;
    dueDate?: string;
    instructor?: string;
    thumbnail?: string;
    tags?: string[];
    level?: 'beginner' | 'intermediate' | 'advanced';
  };
  onStart: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onStart }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {course.thumbnail ? (
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
          <Icons.BookOpen className="w-12 h-12 text-primary/40" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              course.level === 'beginner' && "bg-green-100 text-green-800",
              course.level === 'intermediate' && "bg-yellow-100 text-yellow-800",
              course.level === 'advanced' && "bg-red-100 text-red-800"
            )}>
              {course.level}
            </span>
            {course.required && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Required
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Icons.Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{course.duration}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{course.description}</p>

        {course.instructor && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icons.User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Instructor</p>
              <p className="text-xs text-gray-500">{course.instructor}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Icons.Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{course.points} points</span>
            </div>
            {course.dueDate && (
              <span className="text-sm text-red-600">
                Due by {new Date(course.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Button 
            className="w-full"
            onClick={() => onStart(course.id)}
          >
            {course.progress === 0 ? (
              <>
                <Icons.Play className="w-4 h-4 mr-2" />
                Start Course
              </>
            ) : course.progress === 100 ? (
              <>
                <Icons.RotateCcw className="w-4 h-4 mr-2" />
                Retake Course
              </>
            ) : (
              <>
                <Icons.ArrowRight className="w-4 h-4 mr-2" />
                Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};