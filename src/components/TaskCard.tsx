import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export const TaskCard = React.memo(function TaskCard({ task, onDelete }: TaskCardProps) {
  const done = task.status === 'completed';
  return (
    <View className="mb-2 rounded-lg border border-gray-200 bg-white p-4">
      <View
        accessible
        accessibilityLabel={`${task.title}, estado: ${done ? 'completada' : 'pendiente'}`}
      >
        <Text className="text-base font-semibold text-gray-900">{task.title}</Text>
        <Text className={`mt-1 text-sm ${done ? 'text-green-600' : 'text-gray-500'}`}>
          {done ? '✓ Completada' : '○ Pendiente'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${task.title}`}
        hitSlop={12}
        className="mt-2 self-start py-2 pr-4"
      >
        <Text className="text-sm font-medium text-red-600">Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
});
