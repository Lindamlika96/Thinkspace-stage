/**
 * Query Results Component
 *
 * Displays database query results as table or chart.
 *
 * @example
 * // API response format (from queryDatabaseTool):
 * const apiResponse = {
 *   success: true,
 *   queryResult: {
 *     query: 'Find all projects',
 *     sql: 'SELECT * FROM projects',
 *     results: [{ id: 1, name: 'Project 1' }],
 *     visualization: 'table',
 *     rowCount: 10,
 *   },
 *   message: 'Query executed successfully'
 * };
 *
 * // The component automatically transforms the data:
 * <QueryResults results={apiResponse} />
 *
 * // Or use the transform function directly:
 * const formattedResults = mapQueryResultsToDisplayFormat(apiResponse);
 */

'use client';

import { Paper, Stack, Group, Text, Badge, Button, Table, Code } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';

interface QueryResultsProps {
  results: {
    query: string;
    sql: string;
    results: any[];
    visualization: string;
    rowCount: number;
    message: string;
  };
}

/**
 * Transform function to map API response to QueryResults display format
 * Handles both direct results objects and nested API responses
 *
 * @param results - Raw query results data from API or direct results object
 * @returns Formatted results object ready for display, or null if results is invalid
 */
export function mapQueryResultsToDisplayFormat(results: any): QueryResultsProps['results'] | null {
  // Handle null/undefined cases
  if (!results || results === undefined || results === null) {
    return null;
  }

  // If results is already in the correct format, return as-is
  if (results?.query && results?.sql && results?.results && results?.visualization && results?.rowCount !== undefined) {
    return results;
  }

  // Handle API response format with nested 'queryResult' object
  if (results.queryResult) {
    return {
      query: results.queryResult.query,
      sql: results.queryResult.sql,
      results: results.queryResult.results || [],
      visualization: results.queryResult.visualization || 'table',
      rowCount: results.queryResult.rowCount || results.queryResult.results?.length || 0,
      message: results.message || '',
    };
  }

  // Fallback: try to construct from available fields
  return {
    query: results.query || 'Query',
    sql: results.sql || '',
    results: results.results || results.data || [],
    visualization: results.visualization || 'table',
    rowCount: results.rowCount || results.results?.length || results.data?.length || 0,
    message: results.message || '',
  };
}

export function QueryResults({ results: rawResults }: QueryResultsProps) {
  // Transform the results data to the correct format
  const results = mapQueryResultsToDisplayFormat(rawResults);

  // Handle null/undefined results - return null or loading state
  if (!results) {
    return null;
  }

  const { query, sql, results: rows, visualization, rowCount, message } = results;

  return (
    <Paper p="md" bg="orange.0" radius="md" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconDatabase size={20} />
          <Text fw={500} size="sm">
            Query Results
          </Text>
        </Group>

        <Stack gap="sm" bg="white" p="sm">
          <Group justify="space-between">
            <Text fw={500} size="sm">
              {query}
            </Text>
            <Badge size="sm" variant="light">
              {rowCount} rows
            </Badge>
          </Group>

          <Code block style={{ overflow: 'auto', maxHeight: 100 }}>
            {sql}
          </Code>

          {rows.length > 0 && (
            <Table  striped>
              <Table.Thead>
                <Table.Tr>
                  {Object.keys(rows[0]).map((key) => (
                    <Table.Th key={key}>{key}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row, idx) => (
                  <Table.Tr key={idx}>
                    {Object.values(row).map((value, vidx) => (
                      <Table.Td key={vidx}>
                        <Text size="xs">{String(value)}</Text>
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          <Text size="xs" c="dimmed">
            {message}
          </Text>
        </Stack>

        <Group gap="xs">
          <Button size="xs" variant="light">
            Export CSV
          </Button>
          <Button size="xs" variant="light">
            Export JSON
          </Button>
          <Button size="xs">
            Explain Query
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

