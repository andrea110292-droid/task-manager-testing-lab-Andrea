import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const done = task.status === 'completed';
  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, estado: ${done ? 'completada' : 'pendiente'}`}
      className="mb-2 rounded-lg border border-gray-200 bg-white p-4"
    >
      <Text className="text-base font-semibold text-gray-900">{task.title}</Text>
      <Text className={`mt-1 text-sm ${done ? 'text-green-600' : 'text-gray-500'}`}>
        {done ? '✓ Completada' : '○ Pendiente'}
      </Text>
      <Pressable
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${task.title}`}
      >
        <Text className="mt-2 text-sm font-medium text-red-600">Eliminar</Text>
      </Pressable>
    </View>
  );
}
