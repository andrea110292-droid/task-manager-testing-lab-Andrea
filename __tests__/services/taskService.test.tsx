import { fetchTasks, createTask } from '../../src/services/taskService';
import { server } from '../../src/mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = 'https://api.taskmanager-demo.invalid';

describe('taskService', () => {
  it('createTask crea una tarea vía API con estructura correcta', async () => {
    const task = await createTask('Nueva tarea de prueba');

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Nueva tarea de prueba');
    expect(task.status).toBe('pending');
  });

  it('createTask genera IDs que contienen timestamp (CASO LÍMITE)', async () => {
    const task = await createTask('Tarea 1');

    // El ID debe ser un string de números (timestamp), según el handler mock
    expect(typeof task.id).toBe('string');
    expect(/^\d+$/.test(task.id)).toBe(true);
  });

  it('fetchTasks lanza error cuando la API responde con un error del servidor', async () => {
    // Sobrescribimos el handler para simular una falla de la API
    server.use(
      http.get(`${API_URL}/tasks`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(fetchTasks()).rejects.toThrow('Error al obtener las tareas');
  });

  it('createTask retorna objeto Task con propiedades correctas', async () => {
    const task = await createTask('Verificar propiedades');

    expect(typeof task.id).toBe('string');
    expect(typeof task.title).toBe('string');
    expect(task.status).toBe('pending');
  });

  it('createTask lanza error cuando la API responde con un error (CASO DE ERROR)', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(createTask('Tarea que falla')).rejects.toThrow('Error al crear la tarea');
  });
});
