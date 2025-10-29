/**
 * Floating Chat Button Component
 * 
 * Fixed position button in bottom-right corner with notification badge and animations.
 */

'use client';

import { ActionIcon, Badge, Tooltip, Box } from '@mantine/core';
import { IconBrain } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styles from './ChatButton.module.css';

interface ChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  hasUnread: boolean;
}

export function ChatButton({ isOpen, onToggle, hasUnread }: ChatButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tooltip label="ThinkSpace AI Assistant" position="left">
      <Box
        className={`${styles.chatButton} ${hasUnread ? styles.pulse : ''}`}
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ActionIcon
          size="lg"
          radius="xl"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          className={styles.button}
          aria-label="Open chat"
        >
          <IconBrain size={24} />
        </ActionIcon>
        {hasUnread && (
          <Badge
            size="sm"
            variant="filled"
            color="red"
            className={styles.badge}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
            }}
          >
            ●
          </Badge>
        )}
      </Box>
    </Tooltip>
  );
}

