export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    type: 'individual' | 'department' | 'group';
    value: string;
  };
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'request' | 'assignment' | 'message';
  createdBy: string;
  createdAt: string;
  department?: string;
  group?: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}