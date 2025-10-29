/**
 * Chat Header Component
 * 
 * Header with title, subtitle, and action buttons.
 */

'use client';

import {
  Group,
  Stack,
  Text,
  ActionIcon,
  Menu,
  Select,
  Tooltip,
  Modal,
  Button,
} from '@mantine/core';
import {
  IconX,
  IconTrash,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ParaFilter } from './ParaFilter';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const [paraFilter, setParaFilter] = useState<string | null>(null);
  const [clearModalOpened, { open: openClearModal, close: closeClearModal }] = useDisclosure(false);

  const handleClearConversation = () => {
    // Clear messages logic here
    closeClearModal();
  };

  return (
    <>
      <Stack gap="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-200)' }} pb="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text fw={600} size="md">
              ThinkSpace AI Assistant
            </Text>
            <Text size="xs" c="dimmed">
              {paraFilter ? `Searching in: ${paraFilter}` : 'Ready to help'}
            </Text>
          </Stack>

          <Group gap="xs">
            <Tooltip label="Settings">
              <ActionIcon variant="subtle" size="sm" onClick={() => {}}>
                <IconSettings size={18} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Close">
              <ActionIcon variant="subtle" size="sm" onClick={onClose}>
                <IconX size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Group gap="xs">
          <ParaFilter value={paraFilter} onChange={setParaFilter} />

          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon variant="light" size="sm">
                <IconChevronDown size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                onClick={openClearModal}
                color="red"
              >
                Clear conversation
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>

      <Modal
        opened={clearModalOpened}
        onClose={closeClearModal}
        title="Clear Conversation"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to clear this conversation? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeClearModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleClearConversation}>
              Clear
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

