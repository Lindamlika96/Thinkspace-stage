/**
 * Chat Messages Display Component
 *
 * Displays streamed messages with proper formatting and tool results.
 */

'use client';

import { Stack, ScrollArea, Center, Loader, Text, Box } from '@mantine/core';
import { UIMessage } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  onUnread: () => void;
}

export function ChatMessages({ messages, isLoading, onUnread }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea
      style={{ flex: 1, overflow: 'auto' }}
      type="auto"
      viewportRef={scrollRef}
    >
      <Stack gap="lg" p="md" pb="xl">
        {messages.length === 0 ? (
          <Center h={300}>
            <Stack gap="sm" align="center">
              <Text size="sm" fw={500}>
                Start a conversation with ThinkSpace AI
              </Text>
              <Text size="xs" c="dimmed">
                Ask questions, create projects, or search your knowledge base
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <Center>
                <Loader size="sm" />
              </Center>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Stack>
    </ScrollArea>
  );
}

