/**
 * Context Selector Component
 * 
 * Shows PARA filter chips and selected notes context.
 */

'use client';

import { Group, Chip, Badge, Stack, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface ContextSelectorProps {
  selectedContext: string[];
  onContextChange: (context: string[]) => void;
}

const PARA_CATEGORIES = [
  { value: 'P', label: 'Projects', icon: '🎯', color: 'blue' },
  { value: 'A', label: 'Areas', icon: '🎨', color: 'green' },
  { value: 'R', label: 'Resources', icon: '📚', color: 'purple' },
  { value: 'Archive', label: 'Archives', icon: '📦', color: 'gray' },
];

export function ContextSelector({ selectedContext, onContextChange }: ContextSelectorProps) {
  const handleCategoryChange = (category: string) => {
    if (selectedContext.includes(category)) {
      onContextChange(selectedContext.filter((c) => c !== category));
    } else {
      onContextChange([...selectedContext, category]);
    }
  };

  return (
    <Stack gap="xs">
      <Text size="xs" fw={500} c="dimmed">
        Search in:
      </Text>
      <Group gap="xs">
        {PARA_CATEGORIES.map((category) => (
          <Chip
            key={category.value}
            checked={selectedContext.includes(category.value)}
            onChange={() => handleCategoryChange(category.value)}
            size="xs"
            variant="light"
            color={category.color}
          >
            {category.icon} {category.label}
          </Chip>
        ))}
      </Group>
    </Stack>
  );
}

