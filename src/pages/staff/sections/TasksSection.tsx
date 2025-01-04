import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { EditDialog } from '../../../components/EditDialog';
import { CommentDialog } from '../../../components/CommentDialog';
import supabase from '../../../lib/supabase/client';
import { syncManager } from '../../../lib/utils/sync';

export const TasksSection = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

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
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
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