import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const API_URL = 'https://api.taskmanager-demo.invalid';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

// Espera con margen amplio: la carga inicial depende de una petición interceptada.
const espera = (fn: () => void) => waitFor(fn, { timeout: 8000, interval: 100 });

describe('CreateTaskScreen - Integración', () => {
  it('escenario de ÉXITO: crea una tarea y la muestra en la lista', async () => {
    await renderScreen();

    // Esperamos a que termine la carga inicial desde la API
    await espera(() => expect(screen.getByText('Tarea existente')).toBeTruthy());

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await espera(() => expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy());
    // La interfaz se actualizó con la nueva tarea, junto a las ya existentes
    expect(screen.getByText('Estudiar pruebas de integración')).toBeTruthy();
    expect(screen.getByText('3 tareas')).toBeTruthy();
  }, 30000);

  it('escenario de ERROR: la API falla y se muestra el mensaje de error', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 }))
    );

    await renderScreen();
    await espera(() => expect(screen.getByText('Tarea existente')).toBeTruthy());

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea que va a fallar'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await espera(() => expect(screen.getByText('Error al crear la tarea')).toBeTruthy());
    // La tarea NO debe aparecer en la lista si la API falló
    expect(screen.queryByText('Tarea que va a fallar')).toBeNull();
  }, 30000);

  it('escenario de DATOS VACÍOS: la API responde con una lista vacía', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => HttpResponse.json([])));

    await renderScreen();

    await espera(() => expect(screen.getByText('No hay tareas aún')).toBeTruthy());
    // Confirma que la respuesta vacía reemplazó a los datos del handler por defecto
    expect(screen.queryByText('Tarea existente')).toBeNull();
  }, 30000);

  it('escenario SIN CONEXIÓN: la tarea se guarda localmente y se informa al usuario', async () => {
    server.use(http.post(`${API_URL}/tasks`, () => HttpResponse.error()));

    await renderScreen();
    await espera(() => expect(screen.getByText('Tarea existente')).toBeTruthy());

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea sin conexión'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await espera(() =>
      expect(screen.getByText('Tarea guardada localmente (sin conexión)')).toBeTruthy()
    );
    // El fallback no debe reportar un éxito remoto que no ocurrió
    expect(screen.queryByText('Tarea creada exitosamente')).toBeNull();
    expect(screen.getByText('Tarea sin conexión')).toBeTruthy();
  }, 30000);
});
