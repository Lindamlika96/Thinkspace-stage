/**
 * Sync Status Indicator Component
 * 
 * A subtle, minimal indicator showing the real-time sync status
 * in the page header. Shows connection status with a simple icon.
 */

'use client';

import { Tooltip, ActionIcon, Loader, Group, Text } from '@mantine/core';
import { IconCheck, IconWifi, IconWifiOff, IconAlertCircle } from '@tabler/icons-react';
import { useSyncContext } from '@/components/providers/SyncProvider';

interface SyncStatusIndicatorProps {
  compact?: boolean;
}

export function SyncStatusIndicator({ compact = true }: SyncStatusIndicatorProps) {
  const { isConnected, pendingUpdates, conflicts } = useSyncContext();

  // Determine status and color
  const hasConflicts = conflicts.length > 0;
  const hasPending = pendingUpdates.length > 0;

  let statusColor = 'green';
  let statusLabel = 'Synced';
  let icon = <IconCheck size={18} />;

  if (hasConflicts) {
    statusColor = 'red';
    statusLabel = 'Sync conflicts detected';
    icon = <IconAlertCircle size={18} />;
  } else if (hasPending) {
    statusColor = 'yellow';
    statusLabel = `Syncing (${pendingUpdates.length} pending)`;
    icon = <Loader size={16} />;
  } else if (!isConnected) {
    statusColor = 'gray';
    statusLabel = 'Offline';
    icon = <IconWifiOff size={18} />;
  } else if (isConnected) {
    statusColor = 'green';
    statusLabel = 'Synced';
    icon = <IconCheck size={18} />;
  }

  if (compact) {
    return (
      <Tooltip label={statusLabel} position="bottom">
        <ActionIcon
          variant="subtle"
          color={statusColor}
          size="lg"
          aria-label={statusLabel}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Group gap="xs">
      <ActionIcon
        variant="subtle"
        color={statusColor}
        size="lg"
        aria-label={statusLabel}
      >
        {icon}
      </ActionIcon>
      <Text size="sm" c={statusColor} fw={500}>
        {statusLabel}
      </Text>
    </Group>
  );
}

