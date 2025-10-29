/**
 * Search Results Component
 *
 * Displays search results as interactive cards.
 *
 * @example
 * // API response format (from searchTool):
 * const apiResponse = {
 *   success: true,
 *   searchResults: {
 *     results: [
 *       {
 *         id: '1',
 *         title: 'Note 1',
 *         excerpt: 'Preview text...',
 *         tags: ['tag1'],
 *         lastModified: '2024-01-01',
 *         relevanceScore: 0.95
 *       }
 *     ],
 *     count: 5,
 *     query: 'search term',
 *   },
 *   message: 'Search completed successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <SearchResults results={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedResults = mapSearchResultsToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, Card } from '@mantine/core';
import { IconSearch, IconClock } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  lastModified: string;
  relevanceScore: number;
}

interface SearchResultsProps {
  results: {
    results: SearchResult[];
    count: number;
    query: string;
  };
}

/**
 * Transform function to map API response to SearchResults display format
 * Handles both direct results objects and nested API responses
 *
 * @param results - Raw search results data from API or direct results object
 * @returns Formatted results object ready for display, or null if results is invalid
 */
export function mapSearchResultsToDisplayFormat(results: any): SearchResultsProps['results'] | null {
  // Handle null/undefined cases
  if (!results || results === undefined || results === null) {
    return null;
  }

  // If results is already in the correct format, return as-is
  if (results?.results && results?.count !== undefined && results?.query) {
    return results;
  }

  // Handle API response format with nested 'searchResults' object
  if (results.searchResults) {
    return {
      results: results.searchResults.results || [],
      count: results.searchResults.count || results.searchResults.results?.length || 0,
      query: results.searchResults.query || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    results: results.results || results.items || [],
    count: results.count || results.total || results.results?.length || results.items?.length || 0,
    query: results.query || results.searchQuery || '',
  };
}

export function SearchResults({ results: rawResults }: SearchResultsProps) {
  // Transform the results data to the correct format
  const results = mapSearchResultsToDisplayFormat(rawResults);

  // Handle null/undefined results - return null or loading state
  if (!results) {
    return null;
  }

  const { results: items, count, query } = results;

  return (
    <Paper p="md" bg="blue.0" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconSearch size={20} />
            <Text fw={500} size="sm">
              Found {count} results
            </Text>
          </Group>
          <Badge size="sm" variant="light">
            {query}
          </Badge>
        </Group>

        <Stack gap="sm">
          {items.map((result) => (
            <Card key={result.id} p="sm" bg="white" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500} size="sm" lineClamp={1}>
                    {result.title}
                  </Text>
                  <Badge size="xs" variant="light">
                    {Math.round(result.relevanceScore * 100)}%
                  </Badge>
                </Group>

                <Text size="xs" c="dimmed" lineClamp={2}>
                  {result.excerpt}
                </Text>

                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    {result.tags.map((tag) => (
                      <Badge key={tag} size="xs" variant="dot">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                  <Group gap={4}>
                    <IconClock size={14} />
                    <Text size="xs" c="dimmed">
                      {formatDistanceToNow(new Date(result.lastModified), {
                        addSuffix: true,
                      })}
                    </Text>
                  </Group>
                </Group>

                <Group gap="xs">
                  <Button size="xs" variant="light">
                    Open
                  </Button>
                  <Button size="xs" variant="subtle">
                    Add to Context
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

