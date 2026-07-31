import { renderHook, act } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';

describe('useTaskList', () => {
  it('inicia con una lista vacía por defecto', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.taskCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('agrega una tarea correctamente', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    await act(async () => {
      result.current.addTask('Nueva tarea');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Nueva tarea');
    expect(result.current.tasks[0].status).toBe('pending');
    expect(result.current.error).toBeNull();
  });

  it('establece un error cuando el título está vacío (CASO LÍMITE)', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    await act(async () => {
      result.current.addTask('');
    });
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.error).toBe('El título no puede estar vacío');
  });

  it('limpia el error al agregar una tarea válida después de un error (VALIDAR ORDEN)', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    
    // Paso 1: Intentar agregar tarea vacía
    await act(async () => {
      result.current.addTask('');
    });
    expect(result.current.error).not.toBeNull();

    // Paso 2: Agregar tarea válida
    await act(async () => {
      result.current.addTask('Tarea válida');
    });
    
    // Paso 3: Verificar que error se limpió
    expect(result.current.error).toBeNull();
    expect(result.current.tasks).toHaveLength(1);
  });

  it('elimina una tarea por su id correctamente', async () => {
    const initialTasks = [
      { id: '1', title: 'Tarea 1', status: 'pending' as const },
      { id: '2', title: 'Tarea 2', status: 'completed' as const },
    ];
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList(initialTasks));
    
    await act(async () => {
      result.current.removeTask('1');
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('2');
  });

  it('valida que el contador de tareas se actualiza al agregar (ESTADO CONDICIONAL)', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    
    expect(result.current.taskCount).toBe(0);

    await act(async () => {
      result.current.addTask('Tarea 1');
    });
    expect(result.current.taskCount).toBe(1);

    await act(async () => {
      result.current.addTask('Tarea 2');
    });
    expect(result.current.taskCount).toBe(2);
  });

  it('valida que el largo del array coincide con el conteo (CASO LÍMITE)', async () => {
    // @ts-ignore
    const { result } = await renderHook(() => useTaskList());
    
    await act(async () => {
      result.current.addTask('Tarea Test');
    });

    // El taskCount debe coincidir con el número de tareas
    expect(result.current.tasks.length).toBe(result.current.taskCount);
  });
});
