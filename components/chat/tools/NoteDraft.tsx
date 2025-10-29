/**
 * Note Draft Component
 *
 * Shows note draft preview with markdown rendering.
 *
 * @example
 * // API response format (from draftNoteTool):
 * const apiResponse = {
 *   success: true,
 *   note: {
 *     id: '123',
 *     title: 'My Note',
 *     preview: 'Note content preview...',
 *     tags: ['project', 'important'],
 *     category: 'P'
 *   },
 *   message: 'Note drafted successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <NoteDraft draft={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedDraft = mapDraftToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, Tabs, Loader } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { useState } from 'react';

interface NoteDraftProps {
  draft: {
    id: string;
    title: string;
    preview: string;
    tags: string[];
    category: string;
    message: string;
  };
}

/**
 * Transform function to map API response to NoteDraft display format
 * Handles both direct draft objects and nested API responses
 *
 * @param draft - Raw draft data from API or direct draft object
 * @returns Formatted draft object ready for display, or null if draft is invalid
 */
export function mapDraftToDisplayFormat(draft: any): NoteDraftProps['draft'] | null {
  // Handle null/undefined cases
  if (!draft || draft === undefined || draft === null) {
    return null;
  }

  // If draft is already in the correct format, return as-is
  if (draft?.id && draft?.title && draft?.preview && draft?.tags && draft?.category) {
    return draft;
  }

  // Handle API response format with nested 'note' object
  if (draft.note) {
    return {
      id: draft.note.id,
      title: draft.note.title,
      preview: draft.note.preview,
      tags: draft.note.tags || [],
      category: draft.note.category,
      message: draft.message || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    id: draft.id || '',
    title: draft.title || 'Untitled Note',
    preview: draft.preview || draft.content?.substring(0, 150) || '',
    tags: draft.tags || [],
    category: draft.category || draft.paraCategory || 'A',
    message: draft.message || '',
  };
}

export function NoteDraft({ draft: rawDraft }: NoteDraftProps) {
  // Transform the draft data to the correct format
  const draft = mapDraftToDisplayFormat(rawDraft);

  console.log("🚀 ~ NoteDraft ~ draft:", draft)
  const [activeTab, setActiveTab] = useState<string | null>('preview');

  const PARA_COLORS: Record<string, string> = {
    P: 'blue',
    A: 'green',
    R: 'purple',
    Arch: 'gray',
  };

  // Handle null/undefined draft - show loading state
  if (!draft) {
    return (
      <Paper p="md" bg="orange.0" radius="md" withBorder>
        <Stack gap="md">
          <Group gap="xs">
            <IconFileText size={20} />
            <Text fw={500} size="sm">
              Draft Note
            </Text>
          </Group>
          <Stack gap="sm" bg="white" p="sm" align="center">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Drafting note...
            </Text>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" bg="orange.0" radius="md" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconFileText size={20} />
          <Text fw={500} size="sm">
            Draft Note
          </Text>
        </Group>

        <Stack gap="sm" bg="white" p="sm">
          <Group justify="space-between">
            <Text fw={500} size="sm">
              {draft.title}
            </Text>
            <Badge
              size="sm"
              color={PARA_COLORS[draft.category]}
              variant="light"
            >
              {draft.category}
            </Badge>
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="preview">Preview</Tabs.Tab>
              <Tabs.Tab value="edit">Edit</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="preview" pt="md">
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                {draft.preview}
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="edit" pt="md">
              <Text size="xs" c="dimmed">
                Edit functionality coming soon
              </Text>
            </Tabs.Panel>
          </Tabs>

          <Group gap="xs">
            {draft.tags.map((tag) => (
              <Badge key={tag} size="xs" variant="dot">
                {tag}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Group gap="xs">
          <Button size="xs" variant="light">
            Discard
          </Button>
          <Button size="xs" variant="light">
            Edit
          </Button>
          <Button size="xs">
            Save Note
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

