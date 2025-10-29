/**
 * Project Preview Component
 *
 * Shows project creation preview with confirmation.
 *
 * @example
 * // API response format (from createProjectTool):
 * const apiResponse = {
 *   success: true,
 *   project: {
 *     id: '123',
 *     title: 'My Project',
 *     description: 'Project description...',
 *     goalsCount: 3,
 *     tasksCount: 10,
 *   },
 *   message: 'Project created successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <ProjectPreview project={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedProject = mapProjectToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, List } from '@mantine/core';
import { IconFolderPlus, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

interface ProjectPreviewProps {
  project: {
    id: string;
    title: string;
    description: string;
    goalsCount: number;
    tasksCount: number;
    message: string;
  };
}

/**
 * Transform function to map API response to ProjectPreview display format
 * Handles both direct project objects and nested API responses
 *
 * @param project - Raw project data from API or direct project object
 * @returns Formatted project object ready for display, or null if project is invalid
 */
export function mapProjectToDisplayFormat(project: any): ProjectPreviewProps['project'] | null {
  // Handle null/undefined cases
  if (!project || project === undefined || project === null) {
    return null;
  }

  // If project is already in the correct format, return as-is
  if (project?.id && project?.title && project?.description && project?.goalsCount !== undefined && project?.tasksCount !== undefined) {
    return project;
  }

  // Handle API response format with nested 'project' object
  if (project.project) {
    return {
      id: project.project.id,
      title: project.project.title,
      description: project.project.description,
      goalsCount: project.project.goalsCount || 0,
      tasksCount: project.project.tasksCount || 0,
      message: project.message || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    id: project.id || '',
    title: project.title || project.name || 'Untitled Project',
    description: project.description || '',
    goalsCount: project.goalsCount || project.goals?.length || 0,
    tasksCount: project.tasksCount || project.tasks?.length || 0,
    message: project.message || '',
  };
}

export function ProjectPreview({ project: rawProject }: ProjectPreviewProps) {
  // Transform the project data to the correct format
  const project = mapProjectToDisplayFormat(rawProject);

  const [isConfirmed, setIsConfirmed] = useState(false);

  // Handle null/undefined project - return null or loading state
  if (!project) {
    return null;
  }

  if (isConfirmed) {
    return (
      <Paper p="md" bg="green.0" radius="md" withBorder>
        <Group gap="md">
          <IconCheck size={24} color="green" />
          <Stack gap={0}>
            <Text fw={500} size="sm">
              Project Created Successfully
            </Text>
            <Text size="xs" c="dimmed">
              {project.message}
            </Text>
          </Stack>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md" bg="green.0" radius="md" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconFolderPlus size={20} />
          <Text fw={500} size="sm">
            Create Project
          </Text>
        </Group>

        <Stack gap="sm" bg="white" p="sm" >
          <Group justify="space-between">
            <Text fw={500}>{project.title}</Text>
            <Badge size="sm" variant="light">
              New
            </Badge>
          </Group>

          <Text size="xs" c="dimmed">
            {project.description}
          </Text>

          <List size="sm">
            <List.Item>
              <strong>{project.goalsCount}</strong> goals defined
            </List.Item>
            <List.Item>
              <strong>{project.tasksCount}</strong> tasks created
            </List.Item>
          </List>
        </Stack>

        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            onClick={() => setIsConfirmed(false)}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            onClick={() => setIsConfirmed(true)}
          >
            Create Project
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

