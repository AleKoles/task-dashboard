import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className="relative flex items-start justify-between p-2 border rounded mb-2 bg-white">
      <div className="flex flex-col gap-2">
        <div
          className={`flex-1 cursor-pointer ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}
          onClick={() => onToggle(task.id)}
        >
          {task.title}
        </div>
        <p className="text-xs text-gray-400">
          Created: {new Date(task.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className={`text-xs font-medium ${
          task.priority === 'high' ? 'text-red-500' :
          task.priority === 'low' ? 'text-green-500' : 'text-yellow-500'
        }`}>
          Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </p>
      </div>
      <p className="text-sm text-gray-800 mr-8">
        Due: {new Date(task.dueDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <button
        onClick={() => onDelete(task.id)}
        className="absolute top-1 right-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
