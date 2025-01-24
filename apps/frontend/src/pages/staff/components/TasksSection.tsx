import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { EditDialog } from '../../../../components/EditDialog';
import { CommentDialog } from '../../../../components/CommentDialog';
import { supabase } from '../../../../lib/supabase/client';
import { syncManager } from '../../../../lib/utils/sync';
import { cn } from '../../../../lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

const TaskItem: React.FC<Task> = ({ title, description, priority, status, dueDate, assignedTo }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            priorityColors[priority]
          )}>
            {priority}
          </span>
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            statusColors[status]
          )}>
            {status}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Due: {dueDate}</span>
        <span>Assigned to: {assignedTo}</span>
      </div>
    </div>
  );
};

export const TasksSection = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching tasks:', error);
        } else {
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h2>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Icons.Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{task.title}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'High' 
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
            <p className="text-sm text-gray-500">Due: {task.due_date}</p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTask(task);
                  setShowEdit(true);
                }}
              >
                <Icons.Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTask(task);
                  setShowComment(true);
                }}
              >
                <Icons.MessageCircle className="w-4 h-4 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {selectedTask && (
        <EditDialog
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setSelectedTask(null);
          }}
          onSave={async (data) => {
            try {
              await syncManager.addOperation({
                table: 'tasks',
                type: 'UPDATE',
                data: {
                  ...data,
                  updated_at: new Date().toISOString(),
                },
                timestamp: Date.now(),
              });
              console.log('Task update queued');
            } catch (error) {
              console.error('Error queueing task update:', error);
            }
            setShowEdit(false);
            setSelectedTask(null);
          }}
          data={selectedTask}
          type="staff"
        />
      )}

      {/* Comment Dialog */}
      {selectedTask && (
        <CommentDialog
          isOpen={showComment}
          onClose={() => {
            setShowComment(false);
            setSelectedTask(null);
          }}
          onSubmit={async (comment) => {
            try {
              await syncManager.addOperation({
                table: 'comments',
                type: 'INSERT',
                data: {
                  content: comment,
                  task_id: selectedTask.id,
                  created_at: new Date().toISOString(),
                },
                timestamp: Date.now(),
              });
              console.log('Task comment queued for adding');
            } catch (error) {
              console.error('Error queueing task comment:', error);
            }
            setShowComment(false);
            setSelectedTask(null);
          }}
          title={`Add Comment - ${selectedTask?.title}`}
        />
      )}
    </motion.div>
  );
};