import { useState } from 'react';
import { createTask } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);

  const submit = async (title: string): Promise<boolean> => {
    setStatus('loading');
    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus('success');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { status, tasks, submit, removeTask };
}
