/**
 * Timeline Visualization Component
 *
 * Displays interactive timeline for projects.
 *
 * @example
 * // API response format (from createTimelineTool):
 * const apiResponse = {
 *   success: true,
 *   timeline: {
 *     projectId: '123',
 *     projectTitle: 'My Project',
 *     eventsCount: 5,
 *     events: [{ title: 'Event 1', date: '2024-01-01', isMilestone: true }],
 *   },
 *   message: 'Timeline created successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <TimelineVisualization timeline={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedTimeline = mapTimelineToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, Timeline } from '@mantine/core';
import { IconCalendar, IconCheck } from '@tabler/icons-react';

interface TimelineEvent {
  title: string;
  date: string;
  isMilestone: boolean;
}

interface TimelineVisualizationProps {
  timeline: {
    projectId: string;
    projectTitle: string;
    eventsCount: number;
    events: TimelineEvent[];
    message: string;
  };
}

/**
 * Transform function to map API response to TimelineVisualization display format
 * Handles both direct timeline objects and nested API responses
 *
 * @param timeline - Raw timeline data from API or direct timeline object
 * @returns Formatted timeline object ready for display, or null if timeline is invalid
 */
export function mapTimelineToDisplayFormat(timeline: any): TimelineVisualizationProps['timeline'] | null {
  // Handle null/undefined cases
  if (!timeline || timeline === undefined || timeline === null) {
    return null;
  }

  // If timeline is already in the correct format, return as-is
  if (timeline?.projectId && timeline?.projectTitle && timeline?.events && timeline?.eventsCount !== undefined) {
    return timeline;
  }

  // Handle API response format with nested 'timeline' object
  if (timeline.timeline) {
    return {
      projectId: timeline.timeline.projectId,
      projectTitle: timeline.timeline.projectTitle,
      eventsCount: timeline.timeline.eventsCount || timeline.timeline.events?.length || 0,
      events: timeline.timeline.events || [],
      message: timeline.message || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    projectId: timeline.projectId || '',
    projectTitle: timeline.projectTitle || timeline.title || 'Untitled Timeline',
    eventsCount: timeline.eventsCount || timeline.events?.length || 0,
    events: timeline.events || [],
    message: timeline.message || '',
  };
}

export function TimelineVisualization({ timeline: rawTimeline }: TimelineVisualizationProps) {
  // Transform the timeline data to the correct format
  const timeline = mapTimelineToDisplayFormat(rawTimeline);

  // Handle null/undefined timeline - return null or loading state
  if (!timeline) {
    return null;
  }
  return (
    <Paper p="md" bg="cyan.0" radius="md" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconCalendar size={20} />
          <Text fw={500} size="sm">
            Project Timeline
          </Text>
        </Group>

        <Stack gap="sm" bg="white" p="sm" >
          <Group justify="space-between">
            <Text fw={500} size="sm">
              {timeline.projectTitle}
            </Text>
            <Badge size="sm" variant="light">
              {timeline.eventsCount} events
            </Badge>
          </Group>

          <Timeline active={timeline.eventsCount} bulletSize={24} lineWidth={2}>
            {timeline.events.map((event, idx) => (
              <Timeline.Item
                key={idx}
                bullet={event.isMilestone ? <IconCheck size={12} /> : undefined}
                title={
                  <Text fw={500} size="sm">
                    {event.title}
                  </Text>
                }
              >
                <Text size="xs" c="dimmed">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Stack>

        <Group gap="xs">
          <Button size="xs" variant="light">
            Edit Timeline
          </Button>
          <Button size="xs" variant="light">
            Export
          </Button>
          <Button size="xs">
            Add to Note
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

