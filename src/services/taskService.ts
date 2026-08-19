import { Task } from '../types';

const API_URL = 'https://api.taskmanager-demo.invalid';

export interface CreateTaskResult {
  task: Task;
  source: 'remote' | 'local';
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Error al obtener las tareas');
  return res.json();
}

export async function createTask(title: string): Promise<CreateTaskResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  } catch {
    // Sin conexión con la API: se crea localmente, pero se informa el origen
    // para que la interfaz no reporte un éxito remoto que no ocurrió.
    return {
      task: { id: `local-${Date.now()}`, title, status: 'pending' },
      source: 'local',
    };
  }
  if (!res.ok) throw new Error('Error al crear la tarea');
  return { task: await res.json(), source: 'remote' };
}
