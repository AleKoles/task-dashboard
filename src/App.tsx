import { useEffect, useState } from 'react';
import { Task } from './types/task';
import { getTasksFromLocalStorage, saveTasksToLocalStorage } from './utils/localStorage';
import TaskList from './components/TaskList';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [sortMode, setSortMode] = useState<'created' | 'priority'>('created');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = getTasksFromLocalStorage();
    setTasks(stored);
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return; 

    const finalDueDate = dueDate || today;

    const task: Task = {
      id: uuidv4(),
      title: newTask,
      status: 'active',
      createdAt: new Date().toISOString(),
      dueDate: finalDueDate,
      priority,
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate('');
    setPriority('normal');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'active' ? 'completed' : 'active' }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getSortedTasks = () => {
    const sorted = [...tasks];
  
    if (sortMode === 'priority') {
      const priorityOrder: Record<string, number> = {
        high: 0,
        normal: 1,
        low: 2,
      };
  
      // First, sort by due date (today should come before tomorrow)
      sorted.sort((a, b) => {
        const aDueDate = new Date(a.dueDate).getTime();
        const bDueDate = new Date(b.dueDate).getTime();
  
        // Sort due dates (tasks due today should come first)
        if (aDueDate === bDueDate) return 0;
        return aDueDate - bDueDate; // Due date comparison
      });
  
      // Then, for tasks with the same due date, sort by priority (High > Normal > Low)
      sorted.sort((a, b) => {
        if (new Date(a.dueDate).getTime() === new Date(b.dueDate).getTime()) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0; // If due dates differ, maintain the previous sort order
      });
    } else {
      // Default: sort by creation date (latest first)
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  
    return sorted;
  };
  
  

  return (
    <div className="px-4 py-12 lg:my-24 min-h-screen lg:min-h-[75vh] max-w-lg mx-auto bg-amber-300 lg:rounded">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); 
            addTask();
          }
        }}
        className="flex-1 border rounded p-2 mb-2 w-full bg-white"
        placeholder="Add new task..."
      />
      <div className="flex flex-col sm:flex-row mb-4 gap-2 w-full">
        <div className="grid grid-cols-2 sm:flex flex-row gap-x-2">
          <input
            type="date"
            value={dueDate || today} 
            min={today} 
            onChange={(e) => setDueDate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); 
                addTask();
              }
            }}
            className="border px-2 py-2 rounded text-sm w-full sm:w-fit bg-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
            className="border px-2 py-2 rounded text-sm w-full sm:w-fit bg-white"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="normal">🟡 Normal Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className={`px-4 py-2 rounded text-white transition flex-grow
            ${newTask.trim()
              ? 'bg-sky-600 hover:bg-sky-700'
              : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          Add Task
        </button>
      </div>
      <div className="my-4">
        <label className="mr-2 font-medium text-sm">Sort by:</label>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as 'created' | 'priority')}
          className="border px-2 py-2 rounded text-sm bg-white"
        >
          <option value="created">Creation Date</option>
          <option value="priority">Due Date & Priority</option>
        </select>
      </div>

      <TaskList tasks={getSortedTasks()} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
};

export default App;