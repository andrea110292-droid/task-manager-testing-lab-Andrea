import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

const mockTasks: Task[] = [
  { id: '1', title: 'Comprar leche', status: 'pending' },
  { id: '2', title: 'Estudiar React Native', status: 'completed' },
  { id: '3', title: 'Hacer ejercicio', status: 'pending' },
  { id: '4', title: 'Leer documentación de Jest', status: 'completed' },
];

describe('filterTasksByStatus', () => {
  
  describe('cuando hay tareas que coinciden', () => {
    it('devuelve solo las tareas con el estado indicado', () => {
      const result = filterTasksByStatus(mockTasks, 'completed');
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Estudiar React Native');
    });

    it('filtra correctamente tareas con estado pending', () => {
      const result = filterTasksByStatus(mockTasks, 'pending');
      expect(result).toHaveLength(2);
      expect(result).toContain(mockTasks[0]); // Usa toContain
    });
  });

  describe('cuando no hay tareas que coincidan (CASO LÍMITE)', () => {
    it('devuelve un arreglo vacío cuando no hay coincidencias', () => {
      const result = filterTasksByStatus(mockTasks, 'archived');
      expect(result).toEqual([]);
    });

    it('devuelve array vacío cuando la lista de entrada está vacía (CASO LÍMITE)', () => {
      const emptyList: Task[] = [];
      const result = filterTasksByStatus(emptyList, 'pending');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('cuando el estado es especial o inválido', () => {
    it('devuelve todas las tareas cuando el estado es "all"', () => {
      const result = filterTasksByStatus(mockTasks, 'all');
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockTasks);
    });

    it('lanza un error cuando el estado es inválido (CASO LÍMITE)', () => {
      // @ts-expect-error probando entrada inválida en runtime
      expect(() => filterTasksByStatus(mockTasks, 'invalido')).toThrow();
    });

    it('lanza un error cuando el estado es null (CASO LÍMITE)', () => {
      // @ts-expect-error probando entrada nula en runtime
      expect(() => filterTasksByStatus(mockTasks, null)).toThrow();
    });
  });
});
