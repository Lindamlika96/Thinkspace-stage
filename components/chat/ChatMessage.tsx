/**
 * Individual Chat Message Component
 *
 * Displays a single message with proper formatting and tool results.
 */

'use client';

import { Paper, Group, Stack, useMantineTheme } from '@mantine/core';
import { UIMessage } from '@ai-sdk/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ToolCallDisplay } from './ToolCallDisplay';
import { ToolUseIndicator } from './tools/ToolUseIndicator';
import { SearchResults } from './tools/SearchResults';
import { ProjectPreview } from './tools/ProjectPreview';
import { NoteDraft } from './tools/NoteDraft';
import { TimelineVisualization } from './tools/TimelineVisualization';
import { MindMapVisualization } from './tools/MindMapVisualization';
import { QueryResults } from './tools/QueryResults';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const theme = useMantineTheme();

  // Parse tool calls and results from message parts
  const renderContent = () => {
    // UIMessage has a 'parts' array instead of 'content'
    if (!message.parts || message.parts.length === 0) {
      return null;
    }

    // Handle single text part
    if (message.parts.length === 1 && message.parts[0].type === 'text') {
      const text = (message.parts[0] as any).text;
      return <MarkdownRenderer content={text} />;
    }

    // Handle multiple parts with tool use and results
    return (
      <Stack gap="md">
        {message.parts.map((part, idx) => {
          if (part.type === 'text') {
            const text = (part as any).text;
            return <MarkdownRenderer key={idx} content={text} />;
          }

          if (part.type === 'tool-use') {
            return (
              <ToolUseIndicator
                key={idx}
                toolName={(part as any).toolName}
                isLoading={true}
              />
            );
          }

          if (part.type.includes('tool-')) {
            // Render appropriate component based on tool type
            const toolName = (part as any).type;
            const result = (part as any).output;
            console.log("🚀 ~ renderContent ~ result:", result)

            // Handle undefined/streaming results - show loading indicator
            if (!result || result === undefined) {
              return (
                <ToolUseIndicator
                  key={idx}
                  toolName={toolName.replace('tool-', '')}
                  isLoading={true}
                />
              );
            }

            if (toolName === 'tool-search_notes') {
              return <SearchResults key={idx} results={result} />;
            }

            if (toolName === 'tool-create_project') {
              return <ProjectPreview key={idx} project={result} />;
            }

            if (toolName === 'tool-draft_note') {
              // Handle undefined draft - show loading state
              if (!result) {
                return (
                  <ToolUseIndicator
                    key={idx}
                    toolName="draft_note"
                    isLoading={true}
                  />
                );
              }
              return <NoteDraft key={idx} draft={result} />;
            }

            if (toolName === 'tool-create_timeline') {
              return <TimelineVisualization key={idx} timeline={result} />;
            }

            if (toolName === 'tool-create_mindmap') {
              return <MindMapVisualization key={idx} mindmap={result} />;
            }

            if (toolName === 'tool-query_database') {
              return <QueryResults key={idx} results={result} />;
            }

            // Generic tool call display
            return (
              <ToolCallDisplay
                key={idx}
                toolName={toolName.replace('tool-', '')}
                result={result}
              />
            );
          }

          return null;
        })}
      </Stack>
    );
  };

  return (
    <Group justify={isUser ? 'flex-end' : 'flex-start'} w="100%">
      <Paper
        p="md"
        radius="md"
        bg={isUser ? 'blue.6' : 'gray.1'}
        c={isUser ? 'white' : 'inherit'}
        style={{
          maxWidth: '85%',
          wordWrap: 'break-word',
          boxShadow: theme.shadows.sm,
        }}
      >
        {renderContent()}
      </Paper>
    </Group>
  );
}

