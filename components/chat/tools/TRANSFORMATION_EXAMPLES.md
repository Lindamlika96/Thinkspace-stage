# Tool Data Transformation Examples

This document provides practical examples of how the transformation functions handle different data formats.

## Overview

Each tool visualization component includes a transformation function that ensures compatibility between the AI tool's output and the component's expected data structure. These functions handle various input formats gracefully.

## Example 1: MindMapVisualization

### Scenario 1: Direct API Response (Nested Format)
```typescript
import { mapMindMapToDisplayFormat } from '@/components/chat';

// Raw API response from the AI tool
const apiResponse = {
  success: true,
  mindmap: {
    id: 'mm-123',
    title: 'Project Architecture',
    nodesCount: 8,
    nodes: [
      { id: '1', label: 'Frontend', color: '#3b82f6' },
      { id: '2', label: 'Backend', color: '#10b981' },
      { id: '3', label: 'Database', color: '#f59e0b' },
    ],
  },
  message: 'Mind map created successfully'
};

// Transform the data
const formatted = mapMindMapToDisplayFormat(apiResponse);
// Result:
// {
//   id: 'mm-123',
//   title: 'Project Architecture',
//   nodesCount: 8,
//   nodes: [...],
//   message: 'Mind map created successfully'
// }
```

### Scenario 2: Already Formatted Data
```typescript
// Data already in the correct format
const directData = {
  id: 'mm-456',
  title: 'Feature Planning',
  nodesCount: 5,
  nodes: [{ id: '1', label: 'Auth', color: '#8b5cf6' }],
  message: ''
};

const formatted = mapMindMapToDisplayFormat(directData);
// Returns the same object unchanged
```

### Scenario 3: Partial/Fallback Data
```typescript
// Incomplete data - transformation fills in defaults
const partialData = {
  id: 'mm-789',
  title: 'Quick Map',
  nodes: [{ id: '1', label: 'Idea', color: '#ec4899' }],
  // Missing nodesCount and message
};

const formatted = mapMindMapToDisplayFormat(partialData);
// Result:
// {
//   id: 'mm-789',
//   title: 'Quick Map',
//   nodesCount: 1, // Calculated from nodes.length
//   nodes: [...],
//   message: '' // Default empty string
// }
```

---

## Example 2: NoteDraft

### Scenario 1: API Response with Nested Note
```typescript
import { mapDraftToDisplayFormat } from '@/components/chat';

const apiResponse = {
  success: true,
  note: {
    id: 'note-123',
    title: 'Meeting Notes - Q1 Planning',
    preview: 'Discussed project goals and timeline...',
    tags: ['meeting', 'planning', 'q1'],
    category: 'P'
  },
  message: 'Note drafted successfully'
};

const formatted = mapDraftToDisplayFormat(apiResponse);
// Result:
// {
//   id: 'note-123',
//   title: 'Meeting Notes - Q1 Planning',
//   preview: 'Discussed project goals and timeline...',
//   tags: ['meeting', 'planning', 'q1'],
//   category: 'P',
//   message: 'Note drafted successfully'
// }
```

### Scenario 2: Fallback with Content Field
```typescript
// Data with 'content' instead of 'preview'
const contentData = {
  id: 'note-456',
  title: 'Research Notes',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
  tags: ['research'],
  paraCategory: 'R' // Alternative field name
};

const formatted = mapDraftToDisplayFormat(contentData);
// Result:
// {
//   id: 'note-456',
//   title: 'Research Notes',
//   preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ve', // First 150 chars
//   tags: ['research'],
//   category: 'R', // Mapped from paraCategory
//   message: ''
// }
```

---

## Example 3: TimelineVisualization

### Scenario 1: Complete API Response
```typescript
import { mapTimelineToDisplayFormat } from '@/components/chat';

const apiResponse = {
  success: true,
  timeline: {
    projectId: 'proj-123',
    projectTitle: 'Website Redesign',
    eventsCount: 6,
    events: [
      { title: 'Kickoff Meeting', date: '2024-01-15', isMilestone: true },
      { title: 'Design Review', date: '2024-02-01', isMilestone: false },
      { title: 'Development Start', date: '2024-02-15', isMilestone: true },
      { title: 'Beta Testing', date: '2024-03-01', isMilestone: false },
      { title: 'Launch', date: '2024-03-15', isMilestone: true },
    ],
  },
  message: 'Timeline created successfully'
};

const formatted = mapTimelineToDisplayFormat(apiResponse);
```

### Scenario 2: Alternative Field Names
```typescript
// Using 'title' instead of 'projectTitle'
const altData = {
  projectId: 'proj-456',
  title: 'Mobile App Development', // Alternative field
  events: [
    { title: 'Sprint 1', date: '2024-01-01', isMilestone: false },
  ],
  // Missing eventsCount
};

const formatted = mapTimelineToDisplayFormat(altData);
// Result:
// {
//   projectId: 'proj-456',
//   projectTitle: 'Mobile App Development', // Mapped from 'title'
//   eventsCount: 1, // Calculated from events.length
//   events: [...],
//   message: ''
// }
```

---

## Example 4: QueryResults

### Scenario 1: Database Query Response
```typescript
import { mapQueryResultsToDisplayFormat } from '@/components/chat';

const apiResponse = {
  success: true,
  queryResult: {
    query: 'Find all active projects',
    sql: 'SELECT * FROM projects WHERE status = \'active\'',
    results: [
      { id: 1, name: 'Project Alpha', status: 'active', priority: 'high' },
      { id: 2, name: 'Project Beta', status: 'active', priority: 'medium' },
    ],
    visualization: 'table',
    rowCount: 2,
  },
  message: 'Query executed successfully'
};

const formatted = mapQueryResultsToDisplayFormat(apiResponse);
```

### Scenario 2: Alternative Data Field
```typescript
// Using 'data' instead of 'results'
const altData = {
  query: 'Get recent notes',
  sql: 'SELECT * FROM notes ORDER BY created_at DESC LIMIT 10',
  data: [ // Alternative field name
    { id: 1, title: 'Note 1' },
    { id: 2, title: 'Note 2' },
  ],
  visualization: 'table',
  // Missing rowCount
};

const formatted = mapQueryResultsToDisplayFormat(altData);
// Result:
// {
//   query: 'Get recent notes',
//   sql: 'SELECT * FROM notes ORDER BY created_at DESC LIMIT 10',
//   results: [...], // Mapped from 'data'
//   visualization: 'table',
//   rowCount: 2, // Calculated from data.length
//   message: ''
// }
```

---

## Example 5: SearchResults

### Scenario 1: Search API Response
```typescript
import { mapSearchResultsToDisplayFormat } from '@/components/chat';

const apiResponse = {
  success: true,
  searchResults: {
    results: [
      {
        id: 'note-1',
        title: 'TypeScript Best Practices',
        excerpt: 'A comprehensive guide to writing clean TypeScript code...',
        tags: ['typescript', 'programming', 'best-practices'],
        lastModified: '2024-01-15T10:30:00Z',
        relevanceScore: 0.95
      },
      {
        id: 'note-2',
        title: 'React Hooks Guide',
        excerpt: 'Understanding useState, useEffect, and custom hooks...',
        tags: ['react', 'hooks', 'javascript'],
        lastModified: '2024-01-14T15:20:00Z',
        relevanceScore: 0.87
      },
    ],
    count: 2,
    query: 'typescript react',
  },
  message: 'Search completed successfully'
};

const formatted = mapSearchResultsToDisplayFormat(apiResponse);
```

### Scenario 2: Alternative Field Names
```typescript
// Using 'items' and 'total' instead of 'results' and 'count'
const altData = {
  items: [ // Alternative field name
    {
      id: 'proj-1',
      title: 'Website Redesign',
      excerpt: 'Complete overhaul of company website...',
      tags: ['web', 'design'],
      lastModified: '2024-01-10T09:00:00Z',
      relevanceScore: 0.92
    },
  ],
  total: 1, // Alternative field name
  searchQuery: 'website', // Alternative field name
};

const formatted = mapSearchResultsToDisplayFormat(altData);
// Result:
// {
//   results: [...], // Mapped from 'items'
//   count: 1, // Mapped from 'total'
//   query: 'website', // Mapped from 'searchQuery'
// }
```

---

## Example 6: ProjectPreview

### Scenario 1: Project Creation Response
```typescript
import { mapProjectToDisplayFormat } from '@/components/chat';

const apiResponse = {
  success: true,
  project: {
    id: 'proj-123',
    title: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React and Node.js',
    goalsCount: 5,
    tasksCount: 23,
  },
  message: 'Project created successfully'
};

const formatted = mapProjectToDisplayFormat(apiResponse);
```

### Scenario 2: Calculated Counts
```typescript
// Data with arrays instead of counts
const arrayData = {
  id: 'proj-456',
  name: 'Mobile App', // Alternative field name
  description: 'iOS and Android app development',
  goals: [ // Array instead of count
    { id: 1, title: 'Launch MVP' },
    { id: 2, title: 'Reach 1000 users' },
  ],
  tasks: [ // Array instead of count
    { id: 1, title: 'Setup project' },
    { id: 2, title: 'Design UI' },
    { id: 3, title: 'Implement auth' },
  ],
};

const formatted = mapProjectToDisplayFormat(arrayData);
// Result:
// {
//   id: 'proj-456',
//   title: 'Mobile App', // Mapped from 'name'
//   description: 'iOS and Android app development',
//   goalsCount: 2, // Calculated from goals.length
//   tasksCount: 3, // Calculated from tasks.length
//   message: ''
// }
```

---

## Error Handling Examples

### Null/Undefined Input
```typescript
// All transformation functions handle null/undefined gracefully
const result1 = mapMindMapToDisplayFormat(null);
// Returns: null

const result2 = mapDraftToDisplayFormat(undefined);
// Returns: null

const result3 = mapTimelineToDisplayFormat({});
// Returns: null (missing required fields)
```

### Usage in Components
```typescript
function MyComponent({ data }: { data: any }) {
  const formatted = mapMindMapToDisplayFormat(data);
  
  if (!formatted) {
    return <LoadingState />; // or <ErrorState />
  }
  
  return <MindMapVisualization mindmap={formatted} />;
}
```

---

## Testing Transformation Functions

```typescript
import { describe, it, expect } from 'vitest';
import { mapMindMapToDisplayFormat } from '@/components/chat';

describe('mapMindMapToDisplayFormat', () => {
  it('should handle API response format', () => {
    const input = {
      success: true,
      mindmap: {
        id: '1',
        title: 'Test',
        nodesCount: 2,
        nodes: [{ id: '1', label: 'A', color: '#fff' }],
      },
      message: 'Success'
    };
    
    const result = mapMindMapToDisplayFormat(input);
    
    expect(result).toEqual({
      id: '1',
      title: 'Test',
      nodesCount: 2,
      nodes: [{ id: '1', label: 'A', color: '#fff' }],
      message: 'Success'
    });
  });
  
  it('should return null for invalid input', () => {
    expect(mapMindMapToDisplayFormat(null)).toBeNull();
    expect(mapMindMapToDisplayFormat(undefined)).toBeNull();
    expect(mapMindMapToDisplayFormat({})).toBeNull();
  });
  
  it('should calculate missing counts', () => {
    const input = {
      id: '1',
      title: 'Test',
      nodes: [
        { id: '1', label: 'A', color: '#fff' },
        { id: '2', label: 'B', color: '#000' },
      ],
    };
    
    const result = mapMindMapToDisplayFormat(input);
    
    expect(result?.nodesCount).toBe(2);
  });
});
```

---

## Best Practices

1. **Always use transformation functions**: Even if you think the data is already in the correct format, use the transformation function for consistency and safety.

2. **Handle null results**: Always check if the transformation function returns `null` before using the data.

3. **Type safety**: Import transformation functions from the main export to ensure type safety.

4. **Testing**: Write unit tests for transformation functions to ensure they handle all expected input formats.

5. **Documentation**: When creating new tools, document the expected API response format in the component's JSDoc comments.

