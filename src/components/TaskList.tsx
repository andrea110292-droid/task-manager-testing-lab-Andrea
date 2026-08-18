import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
}

// Definido fuera del componente para mantener una referencia estable
// entre renders y no romper la memoización de TaskCard.
const noop = () => {};

export function TaskList({ tasks, onDelete = noop }: TaskListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Task }) => <TaskCard task={item} onDelete={onDelete} />,
    [onDelete]
  );

  const keyExtractor = useCallback((t: Task) => t.id, []);

  if (tasks.length === 0) {
    return <Text className="py-6 text-center text-base text-gray-500">No hay tareas aún</Text>;
  }

  return (
    <View className="flex-1">
      <Text className="mb-2 text-sm font-medium text-gray-500">
        {tasks.length === 1 ? '1 tarea' : `${tasks.length} tareas`}
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
