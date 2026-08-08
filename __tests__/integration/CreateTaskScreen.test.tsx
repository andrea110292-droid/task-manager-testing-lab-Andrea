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

describe('CreateTaskScreen - Integración', () => {
  it('escenario de ÉXITO: crea una tarea y la muestra en la lista', async () => {
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });

    // Validamos que la interfaz también se actualizó con la nueva tarea en la lista
    expect(screen.getByText('Estudiar pruebas de integración')).toBeTruthy();
  }, 30000);

  it('escenario de ERROR: la API falla y se muestra el mensaje de error', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea que va a fallar'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Error al crear la tarea')).toBeTruthy();
    });

    // La tarea NO debe aparecer en la lista si la API falló
    expect(screen.queryByText('Tarea que va a fallar')).toBeNull();
  }, 30000);

  it('escenario de DATOS VACÍOS: la pantalla inicia sin tareas', async () => {
    await renderScreen();

    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
    expect(screen.queryByText('Tarea creada exitosamente')).toBeNull();
  });
});
