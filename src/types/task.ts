export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
  priority: 'low' | 'normal' | 'high';
}
