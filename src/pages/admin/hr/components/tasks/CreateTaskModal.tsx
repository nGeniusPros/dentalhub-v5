import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { Task } from '../../../../../types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [task, setTask] = useState<Partial<Task>>({
    priority: 'medium',
    status: 'pending',
    category: 'assignment',
    assignee: {
      type: 'individual',
      value: ''
    }
  });

  const departments = [
    'Clinical',
    'Administrative',
    'Hygiene',
    'Front Desk',
    'Billing'
  ];

  const groups = [
    'Morning Shift',
    'Afternoon Shift',
    'Evening Shift',
    'Weekend Team',
    'On-Call Team'
  ];

  const staff = [
    { id: '1', name: 'Dr. Sarah Wilson', role: 'Dentist' },
    { id: '2', name: 'John Smith', role: 'Hygienist' },
    { id: '3', name: 'Emily Parker', role: 'Front Desk' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title && task.assignee?.value && task.dueDate) {
      const newTask: Task = {
        id: Date.now().toString(),
        ...task as Omit<Task, 'id'>,
        createdBy: 'HR Manager',
        createdAt: new Date().toISOString().split('T')[0]
      } as Task;
      onSave(newTask);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create New Task</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={task.title || ''}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={task.description || ''}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                value={task.assignee?.type}
                onChange={(e) => setTask({
                  ...task,
                  assignee: { type: e.target.value as Task['assignee']['type'], value: '' }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="individual">Individual</option>
                <option value="department">Department</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {task.assignee?.type === 'individual' ? 'Select Staff' :
                  task.assignee?.type === 'department' ? 'Select Department' :
                  'Select Group'}
              </label>
              <select
                value={task.assignee?.value}
                onChange={(e) => setTask({
                  ...task,
                  assignee: { ...task.assignee!, value: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select...</option>
                {task.assignee?.type === 'individual' && staff.map(person => (
                  <option key={person.id} value={person.name}>
                    {person.name} ({person.role})
                  </option>
                ))}
                {task.assignee?.type === 'department' && departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                {task.assignee?.type === 'group' && groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={task.category}
                onChange={(e) => setTask({ ...task, category: e.target.value as Task['category'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="assignment">Assignment</option>
                <option value="request">Request</option>
                <option value="message">Message</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};