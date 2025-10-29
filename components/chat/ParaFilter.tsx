/**
 * PARA Filter Component
 * 
 * Dropdown to filter chat search by PARA category.
 */

'use client';

import { Select, Group, Badge, ComboboxItem } from '@mantine/core';
import { IconTarget, IconMap, IconBookmark, IconArchive } from '@tabler/icons-react';

interface ParaFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

interface ParaOption extends ComboboxItem {
  icon: string;
}

const PARA_OPTIONS: ParaOption[] = [
  { value: 'all', label: 'All Categories', icon: '🔍' },
  { value: 'P', label: 'Projects', icon: '🎯' },
  { value: 'A', label: 'Areas', icon: '🎨' },
  { value: 'R', label: 'Resources', icon: '📚' },
  { value: 'Arch', label: 'Archives', icon: '📦' },
];

const PARA_COLORS: Record<string, string> = {
  P: 'blue',
  A: 'green',
  R: 'purple',
  Arch: 'gray',
};

export function ParaFilter({ value, onChange }: ParaFilterProps) {
  return (
    <Select
      placeholder="Filter by category"
      data={PARA_OPTIONS}
      value={value}
      onChange={onChange}
      clearable
      searchable
      size="xs"
      style={{ flex: 1 }}
      renderOption={({ option }) => {
        const paraOption = option as ParaOption;
        return (
          <Group gap="xs">
            <span>{paraOption.icon}</span>
            <span>{paraOption.label}</span>
          </Group>
        );
      }}
    />
  );
}

