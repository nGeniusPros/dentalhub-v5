```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import type { Course, Module } from '../../../../../types/learning';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Course) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    points: 0,
    modules: [],
    required: false,
    tags: [],
    status: 'not_started'
  });

  const [currentModule, setCurrentModule] = useState<Partial<Module>>({
    title: '',
    description: '',
    duration: '',
    type: 'video',
    completed: false,
    order: 0
  });

  if (!isOpen) return null;

  const handleAddModule = () => {
    if (currentModule.title && currentModule.type) {
      setCourse(prev => ({
        ...prev,
        modules: [
          ...(prev.modules || []),
          {
            ...currentModule,
            id: Date.now().toString(),
            completed: false,
            order: prev.modules?.length || 0
          } as Module
        ]
      }));
      setCurrentModule({
        title: '',
        description: '',
        duration: '',
        type: 'video',
        completed: false,
        order: (course.modules?.length || 0) + 1
      });
    }
  };

  const handleRemoveModule = (index: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course.title && course.description && course.modules?.length) {
      onAdd({
        ...course,
        id: Date.now().toString(),
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Course);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create New Course</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={course.category}
                onChange={(e) => setCourse({ ...course, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="clinical">Clinical</option>
                <option value="administrative">Administrative</option>
                <option value="compliance">Compliance</option>
                <option value="soft-skills">Soft Skills</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={course.level}
                onChange={(e) => setCourse({ ...course, level: e.target.value as Course['level'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={course.duration}
                onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., 2 hours"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                value={course.points}
                onChange={(e) => setCourse({ ...course, points: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={0}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {course.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setCourse({
                        ...course,
                        tags: course.tags?.filter((_, i) => i !== index)
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="px-3 py-1 border border-gray-200 rounded-full text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !course.tags?.includes(value)) {
                        setCourse({
                          ...course,
                          tags: [...(course.tags || []), value]
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={course.required}
                  onChange={(e) => setCourse({ ...course, required: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Required Course</span>
              </label>
            </div>
          </div>

          {/* Modules Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Course Modules</h3>
              <Button
                type="button"
                onClick={handleAddModule}
                disabled={!currentModule.title}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>

            {/* New Module Form */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  value={currentModule.title}
                  onChange={(e) => setCurrentModule({
                    ...currentModule,
                    title: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={currentModule.type}
                  onChange={(e) => setCurrentModule({
                    ...currentModule,
                    type: e.target.value as Module['type']
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="reading">Reading</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={currentModule.description}
                  onChange={(e) => setCurrentModule({
                    ...currentModule,
                    description: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={currentModule.duration}
                  onChange={(e) => setCurrentModule({
                    ...currentModule,
                    duration: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., 30 minutes"
                />
              </div>
            </div>

            {/* Module List */}
            <div className="space-y-2">
              {course.modules?.map((module, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      module.type === 'video' && "bg-blue-100 text-blue-600",
                      module.type === 'quiz' && "bg-green-100 text-green-600",
                      module.type === 'reading' && "bg-yellow-100 text-yellow-600",
                      module.type === 'interactive' && "bg-purple-100 text-purple-600"
                    )}>
                      {module.type === 'video' && <Icons.Video className="w-4 h-4" />}
                      {module.type === 'quiz' && <Icons.FileQuestion className="w-4 h-4" />}
                      {module.type === 'reading' && <Icons.BookOpen className="w-4 h-4" />}
                      {module.type === 'interactive' && <Icons.Gamepad2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className="text-sm text-gray-500">{module.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveModule(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!course.title || !course.description || !course.modules?.length}
            >
              Create Course
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
```;
