import { Task } from '../types/task';

const STORAGE_KEY = 'tasks';

export const saveTasksToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};