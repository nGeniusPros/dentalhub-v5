import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { CreateTaskModal } from './tasks/CreateTaskModal';
import type { Task } from '../../../../types/task';

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Annual Performance Review',
      description: 'Submit performance review documentation for Q1 2024',
      assignee: {
        type: 'individual',
        value: 'Dr. Sarah Wilson'
      },
      dueDate: '2024-03-20',
      priority: 'high',
      status: 'pending',
      category: 'assignment',
      createdBy: 'HR Manager',
      createdAt: '2024-03-10'
    },
    {
      id: '2',
      title: 'Update Certification Documents',
      description: 'Upload renewed dental license and insurance documents',
      assignee: {
        type: 'department',
        value: 'Clinical'
      },
      dueDate: '2024-03-25',
      priority: 'medium',
      status: 'in-progress',
      category: 'request',
      createdBy: 'Compliance Officer',
      createdAt: '2024-03-12'
    },
    {
      id: '3',
      title: 'Schedule Team Building Event',
      description: 'Coordinate with staff for upcoming team building activity',
      assignee: {
        type: 'group',
        value: 'Morning Shift'
      },
      dueDate: '2024-04-01',
      priority: 'low',
      status: 'pending',
      category: 'message',
      createdBy: 'Office Manager',
      createdAt: '2024-03-15'
    }
  ]);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const handleCreateTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Task Manager</h2>
          <p className="text-sm text-gray-500">Manage staff tasks and requests</p>
        </div>
        <Button onClick={() => setShowNewTaskModal(true)}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  task.category === 'assignment' ? "bg-blue-100 text-blue-600" :
                  task.category === 'request' ? "bg-purple-100 text-purple-600" :
                  "bg-green-100 text-green-600"
                )}>
                  {task.category === 'assignment' && <Icons.Clipboard className="w-5 h-5" />}
                  {task.category === 'request' && <Icons.FileText className="w-5 h-5" />}
                  {task.category === 'message' && <Icons.MessageSquare className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                task.priority === 'high' ? "bg-red-100 text-red-800" :
                task.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              )}>
                {task.priority} priority
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Assignee</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.assignee.value}</span>
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    task.assignee.type === 'individual' && "bg-blue-100 text-blue-800",
                    task.assignee.type === 'department' && "bg-purple-100 text-purple-800",
                    task.assignee.type === 'group' && "bg-green-100 text-green-800"
                  )}>
                    {task.assignee.type}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{task.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{task.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="font-medium">{task.createdAt}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Icons.MessageSquare className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button size="sm" variant="outline">
                  <Icons.Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Icons.Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onSave={handleCreateTask}
      />
    </motion.div>
  );
};