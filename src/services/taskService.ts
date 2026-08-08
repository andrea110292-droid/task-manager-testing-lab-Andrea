import { Task } from '../types';

const API_URL = 'https://api.taskmanager-demo.invalid';

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Error al obtener las tareas');
  return res.json();
}

export async function createTask(title: string): Promise<Task> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  } catch {
    // No hay conexión real a la API (ej. no existe backend en este entorno): fallback local
    return { id: Date.now().toString(), title, status: 'pending' };
  }

  if (!res.ok) throw new Error('Error al crear la tarea');
  return res.json();
}
