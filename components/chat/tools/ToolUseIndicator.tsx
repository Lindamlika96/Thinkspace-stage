/**
 * Tool Use Indicator Component
 * 
 * Shows loading state when AI is using a tool.
 */

'use client';

import { Paper, Group, Loader, Stack, Text, Badge } from '@mantine/core';
import {
  IconSearch,
  IconFolderPlus,
  IconFileText,
  IconLink,
  IconCalendar,
  IconBrain,
  IconDatabase,
} from '@tabler/icons-react';

interface ToolUseIndicatorProps {
  toolName: string;
  isLoading: boolean;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_notes: <IconSearch size={20} />,
  create_project: <IconFolderPlus size={20} />,
  draft_note: <IconFileText size={20} />,
  link_notes: <IconLink size={20} />,
  create_timeline: <IconCalendar size={20} />,
  create_mindmap: <IconBrain size={20} />,
  query_database: <IconDatabase size={20} />,
};

const TOOL_LABELS: Record<string, string> = {
  search_notes: 'Searching notes',
  create_project: 'Creating project',
  draft_note: 'Drafting note',
  link_notes: 'Creating link',
  create_timeline: 'Generating timeline',
  create_mindmap: 'Creating mind map',
  query_database: 'Querying database',
};

export function ToolUseIndicator({ toolName, isLoading }: ToolUseIndicatorProps) {
  return (
    <Paper p="md" bg="blue.0" radius="md" withBorder>
      <Stack gap="sm">
        <Group gap="md">
          {TOOL_ICONS[toolName] || <IconSearch size={20} />}
          <Stack gap={0}>
            <Text fw={500} size="sm">
              {TOOL_LABELS[toolName] || toolName}
            </Text>
            <Text size="xs" c="dimmed">
              Processing...
            </Text>
          </Stack>
          {isLoading && <Loader size="sm" ml="auto" />}
        </Group>
      </Stack>
    </Paper>
  );
}

