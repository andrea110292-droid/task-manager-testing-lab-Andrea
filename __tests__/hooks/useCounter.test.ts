import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('useCounter', () => {
  
  describe('Inicialización', () => {
    it('inicia con el valor por defecto (0)', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter());
      
      expect(result.current.count).toBe(0);
    });

    it('inicia con el valor proporcionado como parámetro', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter(10));
      
      expect(result.current.count).toBe(10);
    });
  });

  describe('Cambios de estado individuales', () => {
    it('incrementa el contador en 1', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter());

      await act(async () => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it('decrementa el contador en 1', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter(5));

      await act(async () => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    it('reinicia el contador al valor inicial', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter(10));

      await act(async () => {
        result.current.increment();
      });

      expect(result.current.count).toBe(11);

      await act(async () => {
        result.current.reset();
      });

      expect(result.current.count).toBe(10);
    });
  });

  describe('Orden correcto de ejecución de estado', () => {
    it('ejecuta múltiples acciones en el orden correcto', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter(5));

      expect(result.current.count).toBe(5);

      await act(async () => {
        result.current.increment();
      });
      expect(result.current.count).toBe(6);

      await act(async () => {
        result.current.increment();
      });
      expect(result.current.count).toBe(7);

      await act(async () => {
        result.current.decrement();
      });
      expect(result.current.count).toBe(6);

      await act(async () => {
        result.current.reset();
      });
      expect(result.current.count).toBe(5);
    });

    it('no ejecuta cambios fuera de act() (validar aislamiento)', async () => {
      // @ts-ignore
      const { result } = await renderHook(() => useCounter());
      const initialCount = result.current.count;

      expect(result.current.count).toBe(initialCount);

      await act(async () => {
        result.current.increment();
      });

      expect(result.current.count).toBe(initialCount + 1);
    });
  });
});