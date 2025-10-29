/**
 * Tool Call Display Component
 *
 * Displays tool/function calls with clear visual distinction and proper formatting.
 * Shows tool name, parameters, and results with appropriate styling.
 */

'use client';

import React from 'react';
import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Code,
  Accordion,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import {
  IconSearch,
  IconFolderPlus,
  IconFileText,
  IconLink,
  IconCalendar,
  IconBrain,
  IconDatabase,
  IconChevronDown,
} from '@tabler/icons-react';

interface ToolCallDisplayProps {
  toolName: string;
  parameters?: Record<string, any>;
  result?: any;
  isLoading?: boolean;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_notes: <IconSearch size={18} />,
  create_project: <IconFolderPlus size={18} />,
  draft_note: <IconFileText size={18} />,
  link_notes: <IconLink size={18} />,
  create_timeline: <IconCalendar size={18} />,
  create_mindmap: <IconBrain size={18} />,
  query_database: <IconDatabase size={18} />,
};

const TOOL_LABELS: Record<string, string> = {
  search_notes: 'Search Notes',
  create_project: 'Create Project',
  draft_note: 'Draft Note',
  link_notes: 'Link Notes',
  create_timeline: 'Create Timeline',
  create_mindmap: 'Create Mind Map',
  query_database: 'Query Database',
};

const TOOL_COLORS: Record<string, string> = {
  search_notes: 'blue',
  create_project: 'green',
  draft_note: 'violet',
  link_notes: 'cyan',
  create_timeline: 'orange',
  create_mindmap: 'grape',
  query_database: 'indigo',
};

export function ToolCallDisplay({
  toolName,
  parameters,
  result,
  isLoading = false,
}: ToolCallDisplayProps) {
  const theme = useMantineTheme();
  const color = TOOL_COLORS[toolName] || 'gray';
  const icon = TOOL_ICONS[toolName];
  const label = TOOL_LABELS[toolName] || toolName;

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      bg={`${color}.0`}
      style={{
        borderColor: theme.colors[color][3],
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <Group gap="md" justify="space-between">
          <Group gap="sm">
            <ThemeIcon
              size="lg"
              radius="md"
              variant="light"
              color={color}
            >
              {icon}
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={600} size="sm">
                {label}
              </Text>
              <Text size="xs" c="dimmed">
                {isLoading ? 'Processing...' : 'Tool call'}
              </Text>
            </Stack>
          </Group>
          <Badge size="sm" variant="light" color={color}>
            {toolName}
          </Badge>
        </Group>

        {/* Parameters */}
        {parameters && Object.keys(parameters).length > 0 && (
          <Accordion
            defaultValue="parameters"
            variant="contained"
          >
            <Accordion.Item value="parameters">
              <Accordion.Control>
                <Text size="sm" fw={500}>
                  Parameters
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key}>
                      <Text size="xs" fw={500} c="dimmed">
                        {key}
                      </Text>
                      <Code
                        block
                        p="xs"
                        bg="white"
                        style={{
                          overflow: 'auto',
                          maxHeight: '200px',
                        }}
                      >
                        {typeof value === 'string'
                          ? value
                          : JSON.stringify(value, null, 2)}
                      </Code>
                    </div>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}

        {/* Result */}
        {result && !isLoading && (
          <Accordion
            defaultValue="result"
            variant="contained"
          >
            <Accordion.Item value="result">
              <Accordion.Control>
                <Text size="sm" fw={500}>
                  Result
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Code
                  block
                  p="sm"
                  bg="white"
                  style={{
                    overflow: 'auto',
                    maxHeight: '300px',
                  }}
                >
                  {typeof result === 'string'
                    ? result
                    : JSON.stringify(result, null, 2)}
                </Code>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </Stack>
    </Paper>
  );
}

