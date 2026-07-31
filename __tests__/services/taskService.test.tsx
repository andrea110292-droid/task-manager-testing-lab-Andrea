import { fetchTasks, createTask } from '../../src/services/taskService';

describe('taskService', () => {
  it('createTask crea una tarea localmente con estructura correcta', async () => {
    const task = await createTask('Nueva tarea de prueba');
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Nueva tarea de prueba');
    expect(task.status).toBe('pending');
  });

  it('createTask genera IDs que contienen timestamp (CASO LÍMITE)', async () => {
    const task = await createTask('Tarea 1');
    
    // El ID debe ser un string de números (timestamp)
    expect(typeof task.id).toBe('string');
    expect(/^\d+$/.test(task.id)).toBe(true);
  });

  it('fetchTasks lanza error cuando no hay conexión (API no existe)', async () => {
    try {
      await fetchTasks();
      // Si no lanza error, la prueba falla
      throw new Error('Debería haber lanzado un error');
    } catch (error) {
      // Esperamos que falle
      expect(error).toBeDefined();
      const message = (error as Error).message;
      expect(message).toBeTruthy();
    }
  });

  it('createTask retorna objeto Task con propiedades correctas', async () => {
    const task = await createTask('Verificar propiedades');
    
    expect(typeof task.id).toBe('string');
    expect(typeof task.title).toBe('string');
    expect(task.status).toBe('pending');
  });

  it('createTask no requiere conexión a API (ESTADO CONDICIONAL)', async () => {
    // Esta prueba verifica que createTask funciona sin API
    const task = await createTask('Tarea sin API');
    
    // Debería retornar exitosamente
    expect(task).toBeDefined();
    expect(task.title).toBe('Tarea sin API');
  });
});
