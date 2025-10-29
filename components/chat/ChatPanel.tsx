/**
 * Expandable Chat Panel Component
 *
 * Slide-in panel from bottom-right with responsive dimensions.
 */

'use client';

import { Paper, Stack, Transition, Box, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import styles from './ChatPanel.module.css';

interface ChatPanelProps {
  onClose: () => void;
  onUnread: () => void;
}

export function ChatPanel({ onClose, onUnread }: ChatPanelProps) {
  const [mounted, setMounted] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 576px)');

  // Initialize useChat hook
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/stream' }),
  });

  const [input, setInput] = useState('');

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && (
        <Box
          className={styles.backdrop}
          onClick={onClose}
          style={{
            display: 'block',
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      <Transition
        mounted={true}
        transition="slide-up"
        duration={300}
        timingFunction="ease-out"
      >
        {(styles_transition) => (
          <Paper
            className={styles.panel}
            style={{
              ...styles_transition,
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1001,
              width: 'clamp(300px, 90vw, 450px)',
              height: 'clamp(400px, 90vh, 700px)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            p="md"
            radius="lg"
          >
            <Stack gap="md" h="100%" style={{ overflow: 'hidden' }}>
              <ChatHeader onClose={onClose} />
              <ChatMessages messages={messages} isLoading={isLoading} onUnread={onUnread} />
              <ChatInput
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={(e) => {
                  console.log("🚀 ~ file: ChatPanel.tsx:137 ~ ChatPanel ~ handleSubmit ~ e:", e)
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({
                      parts: [{ type: 'text', text: input }],
                    });
                    setInput('');
                  }
                }}
                isLoading={isLoading}
                onStop={stop}
              />
            </Stack>
          </Paper>
        )}
      </Transition>
    </>
  );
}

