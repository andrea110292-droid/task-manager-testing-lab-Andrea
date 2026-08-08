import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm - Accesibilidad', () => {
  it('el campo de texto tiene un accessibilityLabel descriptivo (rol accesible)', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const input = screen.getByLabelText('Título de la tarea');

    expect(input).toBeTruthy();
    expect(input).toHaveProp('accessibilityLabel', 'Título de la tarea');
  });

  it('el botón "Guardar" tiene accessibilityRole de tipo botón', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const button = screen.getByRole('button');

    expect(button).toBeTruthy();
    expect(button).toHaveProp('accessibilityRole', 'button');
  });
});
