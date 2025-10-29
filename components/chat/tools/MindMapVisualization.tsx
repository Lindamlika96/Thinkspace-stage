/**
 * Mind Map Visualization Component
 *
 * Displays interactive mind map using React Flow.
 *
 * @example
 * // API response format (from mindMapTool):
 * const apiResponse = {
 *   success: true,
 *   mindmap: {
 *     id: '123',
 *     title: 'My Mind Map',
 *     nodesCount: 5,
 *     nodes: [{ id: '1', label: 'Node 1', color: '#blue' }],
 *   },
 *   message: 'Mind map created successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <MindMapVisualization mindmap={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedMindMap = mapMindMapToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, Center, Loader } from '@mantine/core';
import { IconBrain } from '@tabler/icons-react';
import { useState } from 'react';

interface MindmapNode {
  id: string;
  label: string;
  color: string;
}

interface MindMapVisualizationProps {
  mindmap: {
    id: string;
    title: string;
    nodesCount: number;
    nodes: MindmapNode[];
    message: string;
  };
}

/**
 * Transform function to map API response to MindMapVisualization display format
 * Handles both direct mindmap objects and nested API responses
 *
 * @param mindmap - Raw mindmap data from API or direct mindmap object
 * @returns Formatted mindmap object ready for display, or null if mindmap is invalid
 */
export function mapMindMapToDisplayFormat(mindmap: any): MindMapVisualizationProps['mindmap'] | null {
  // Handle null/undefined cases
  if (!mindmap || mindmap === undefined || mindmap === null) {
    return null;
  }

  // If mindmap is already in the correct format, return as-is
  if (mindmap?.id && mindmap?.title && mindmap?.nodes && mindmap?.nodesCount !== undefined) {
    return mindmap;
  }

  // Handle API response format with nested 'mindmap' object
  if (mindmap.mindmap) {
    return {
      id: mindmap.mindmap.id,
      title: mindmap.mindmap.title,
      nodesCount: mindmap.mindmap.nodesCount || mindmap.mindmap.nodes?.length || 0,
      nodes: mindmap.mindmap.nodes || [],
      message: mindmap.message || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    id: mindmap.id || '',
    title: mindmap.title || 'Untitled Mind Map',
    nodesCount: mindmap.nodesCount || mindmap.nodes?.length || 0,
    nodes: mindmap.nodes || [],
    message: mindmap.message || '',
  };
}

export function MindMapVisualization({ mindmap: rawMindMap }: MindMapVisualizationProps) {
  // Transform the mindmap data to the correct format
  const mindmap = mapMindMapToDisplayFormat(rawMindMap);

  console.log("🚀 ~ MindMapVisualization ~ mindmap:", mindmap)
  const [isLoading, setIsLoading] = useState(false);

  // Handle null/undefined mindmap - show loading state
  if (!mindmap) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Group gap="xs">
            <IconBrain size={20} />
            <Text fw={500} size="sm">
              Mind Map
            </Text>
          </Group>
          <Stack gap="sm" bg="white" p="sm" align="center">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Creating mind map...
            </Text>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" bg="purple.0" radius="md" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconBrain size={20} />
          <Text fw={500} size="sm">
            Mind Map
          </Text>
        </Group>

        <Stack gap="sm" bg="white" p="sm" >
          <Group justify="space-between">
            <Text fw={500} size="sm">
              {mindmap.title}
            </Text>
            <Badge size="sm" variant="light">
              {mindmap.nodesCount} nodes
            </Badge>
          </Group>

          <Center h={200} bg="gray.1" >
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <Stack gap="sm" align="center">
                <Text size="xs" c="dimmed">
                  Mind map visualization
                </Text>
                <Group gap="xs">
                  {mindmap.nodes.slice(0, 3).map((node) => (
                    <Badge
                      key={node.id}
                      size="sm"
                      style={{ backgroundColor: node.color }}
                    >
                      {node.label}
                    </Badge>
                  ))}
                  {mindmap.nodes.length > 3 && (
                    <Badge size="sm" variant="light">
                      +{mindmap.nodes.length - 3} more
                    </Badge>
                  )}
                </Group>
              </Stack>
            )}
          </Center>
        </Stack>

        <Group gap="xs">
          <Button size="xs" variant="light">
            Expand
          </Button>
          <Button size="xs" variant="light">
            Export
          </Button>
          <Button size="xs">
            Save as Note
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

