import { create } from 'zustand';
import { mockTasks } from '../mock-data';

export interface Task {
  id: string;
  name: string;
  algorithm: string;
  status: 'ready' | 'running' | 'done' | 'queued';
  progress?: number;
  result?: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  runTask: (id: string) => void;
  setProgress: (id: string, progress: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks as Task[],

  addTask: (task) => set((s) => ({
    tasks: [...s.tasks, { ...task, id: `t${Date.now()}` }],
  })),

  removeTask: (id) => set((s) => ({
    tasks: s.tasks.filter((t) => t.id !== id),
  })),

  updateTask: (id, data) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === id ? { ...t, ...data } : t),
  })),

  runTask: (id) => set((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== id) return t;
      const interval = setInterval(() => {
        useTaskStore.getState().setProgress(id, Math.min(100, Math.round(Math.random() * 20 + 80)));
      }, 300);
      setTimeout(() => {
        clearInterval(interval);
        useTaskStore.getState().updateTask(id, { status: 'done', progress: 100, result: 'success' });
      }, 2500);
      return { ...t, status: 'running' as const, progress: 0 };
    }),
  })),

  setProgress: (id, progress) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === id ? { ...t, progress } : t),
  })),
}));
