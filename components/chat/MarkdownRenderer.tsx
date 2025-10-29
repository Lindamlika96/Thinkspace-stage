/**
 * Markdown Renderer Component
 *
 * Renders markdown content with proper formatting and Mantine styling.
 * Supports headings, lists, code blocks, links, bold, italic, etc.
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { Text, Code, Group, Stack, Anchor, List, ThemeIcon, useMantineTheme } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const theme = useMantineTheme();

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[RemarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <Text component="h1" fw={700} size="lg" mt="md" mb="sm" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <Text component="h2" fw={600} size="md" mt="md" mb="sm" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <Text component="h3" fw={600} size="sm" mt="sm" mb="xs" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <Text component="h4" fw={500} size="sm" mt="sm" mb="xs" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <Text component="h5" fw={500} size="xs" mt="sm" mb="xs" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <Text component="h6" fw={500} size="xs" c="dimmed" mt="sm" mb="xs" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <Text component="p" size="sm" mb="sm" {...props} />
          ),

          // Links
          a: ({ node, ...props }) => (
            <Anchor component="a" size="sm" {...props} />
          ),

          // Inline code
          code: ({ node, ...props }) => {
            const { inline, ...restProps } = props as any;
            if (inline) {
              return (
                <Code
                  bg="gray.1"
                  c="red"
                  px={6}
                  py={2}
                  {...restProps}
                />
              );
            }
            return null; // Handled by pre component
          },

          // Code blocks
          pre: ({ node, ...props }) => (
            <pre
              style={{
                backgroundColor: theme.colors.dark[7],
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
                overflow: 'auto',
                marginBottom: theme.spacing.sm,
              }}
              {...props}
            />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <List type="unordered" size="sm" mb="sm" {...props} />
          ),

          ol: ({ node, type, ...props }) => (
            <List type="ordered" size="sm" mb="sm" {...props} />
          ),

          li: ({ node, ...props }) => (
            <List.Item {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: `4px solid ${theme.colors.blue[5]}`,
                paddingLeft: theme.spacing.md,
                marginLeft: 0,
                marginBottom: theme.spacing.sm,
                color: theme.colors.gray[6],
                fontStyle: 'italic',
              }}
              {...props}
            />
          ),

          // Horizontal rule
          hr: () => (
            <div
              style={{
                borderTop: `1px solid ${theme.colors.gray[3]}`,
                margin: `${theme.spacing.md} 0`,
              }}
            />
          ),

          // Tables (from remark-gfm)
          table: ({ node, ...props }) => (
            <div
              style={{
                overflowX: 'auto',
                marginBottom: theme.spacing.sm,
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: theme.fontSizes.sm,
                }}
                {...props}
              />
            </div>
          ),

          thead: ({ node, ...props }) => (
            <thead
              style={{
                backgroundColor: theme.colors.gray[1],
              }}
              {...props}
            />
          ),

          th: ({ node, ...props }) => (
            <th
              style={{
                padding: theme.spacing.xs,
                textAlign: 'left',
                fontWeight: 600,
                borderBottom: `1px solid ${theme.colors.gray[3]}`,
              }}
              {...props}
            />
          ),

          td: ({ node, ...props }) => (
            <td
              style={{
                padding: theme.spacing.xs,
                borderBottom: `1px solid ${theme.colors.gray[2]}`,
              }}
              {...props}
            />
          ),

          // Strong and emphasis
          strong: ({ node, ...props }) => (
            <Text component="strong" fw={600} {...props} />
          ),

          em: ({ node, ...props }) => (
            <Text component="em" fs="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

