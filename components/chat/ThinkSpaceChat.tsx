/**
 * ThinkSpace AI Chat Main Component
 * 
 * Main container for the chat interface with floating button and expandable panel.
 */

'use client';

import { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';

export function ThinkSpaceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <>
      <ChatButton 
        isOpen={isOpen} 
        onToggle={handleToggle}
        hasUnread={hasUnread}
      />
      {isOpen && (
        <ChatPanel 
          onClose={() => setIsOpen(false)}
          onUnread={() => setHasUnread(true)}
        />
      )}
    </>
  );
}

