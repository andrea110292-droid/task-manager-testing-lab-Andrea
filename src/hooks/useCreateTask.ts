import { useState, useEffect } from 'react';
import { createTask, fetchTasks } from '../services/taskService';
import { Task } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'success-local' | 'error';

export function useCreateTask() {
  const [status, setStatus] = useState<Status>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetchTasks()
      .then((remotas) => {
        if (!cancelado) setTasks(remotas);
      })
      .catch(() => {
        if (!cancelado) setLoadError(true);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const submit = async (title: string): Promise<boolean> => {
    setStatus('loading');
    try {
      const { task, source } = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus(source === 'local' ? 'success-local' : 'success');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { status, tasks, loadError, submit, removeTask };
}
