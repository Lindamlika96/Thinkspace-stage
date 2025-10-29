/**
 * Chat Input Component
 *
 * Enhanced input with textarea, send button, and context selector.
 */

'use client';

import { Group, Textarea, ActionIcon, Stack, Chip, Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import { ContextSelector } from './ContextSelector';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading, onStop }: ChatInputProps) {
  const [selectedContext, setSelectedContext] = useState<string[]>([]);

  return (
    <Stack gap="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-200)' }} pt="md">
      <ContextSelector
        selectedContext={selectedContext}
        onContextChange={setSelectedContext}
      />

      {isLoading && onStop && (
        <Button
          color="red"
          variant="light"
          onClick={onStop}
          fullWidth
        >
          Stop
        </Button>
      )}

      <form onSubmit={handleSubmit}>
        <Group gap="xs" align="flex-end">
          <Textarea
            placeholder="Ask me anything... (Ctrl+Enter to send)"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit(e as any);
              }
            }}
            minRows={2}
            maxRows={4}
            style={{ flex: 1 }}
            disabled={isLoading}
          />

          <ActionIcon
            type="submit"
            size="lg"
            radius="md"
            color="blue"
            variant="filled"
            disabled={isLoading || !input.trim()}
            loading={isLoading}
          >
            <IconSend size={20} />
          </ActionIcon>
        </Group>
      </form>
    </Stack>
  );
}

