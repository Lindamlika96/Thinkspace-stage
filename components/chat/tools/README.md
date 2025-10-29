# Tool Visualization Components

This directory contains visualization components for AI tool results in the chat interface. Each component includes a data transformation function to ensure compatibility between tool output and component requirements.

## Architecture Pattern

All tool visualization components follow a consistent pattern:

1. **Props Interface**: Defines the exact data structure the component expects
2. **Transformation Function**: Maps raw API responses to the component's expected format
3. **Component**: Renders the transformed data with proper error handling

### Transformation Function Pattern

Each component exports a `map*ToDisplayFormat` function that:
- Accepts raw API response data (any type)
- Returns formatted data matching the component's props interface, or `null` if invalid
- Handles multiple input formats:
  - Direct format (already matches component props)
  - Nested API response format (e.g., `{ success: true, data: {...}, message: '...' }`)
  - Fallback format (attempts to construct from available fields)

## Components

### 1. MindMapVisualization

**Purpose**: Displays interactive mind maps with nodes and connections.

**Transformation Function**: `mapMindMapToDisplayFormat(mindmap: any)`

**Expected Format**:
```typescript
{
  id: string;
  title: string;
  nodesCount: number;
  nodes: Array<{
    id: string;
    label: string;
    color: string;
  }>;
  message: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  mindmap: {
    id: '123',
    title: 'My Mind Map',
    nodesCount: 5,
    nodes: [{ id: '1', label: 'Node 1', color: '#blue' }],
  },
  message: 'Mind map created successfully'
}
```

**Usage**:
```tsx
// Automatic transformation
<MindMapVisualization mindmap={apiResponse} />

// Manual transformation
const formatted = mapMindMapToDisplayFormat(apiResponse);
if (formatted) {
  <MindMapVisualization mindmap={formatted} />
}
```

---

### 2. NoteDraft

**Purpose**: Shows note draft preview with markdown rendering.

**Transformation Function**: `mapDraftToDisplayFormat(draft: any)`

**Expected Format**:
```typescript
{
  id: string;
  title: string;
  preview: string;
  tags: string[];
  category: string; // 'P' | 'A' | 'R' | 'Arch'
  message: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  note: {
    id: '123',
    title: 'My Note',
    preview: 'Note content preview...',
    tags: ['project', 'important'],
    category: 'P'
  },
  message: 'Note drafted successfully'
}
```

**Usage**:
```tsx
<NoteDraft draft={apiResponse} />
```

---

### 3. TimelineVisualization

**Purpose**: Displays interactive timeline for projects with events and milestones.

**Transformation Function**: `mapTimelineToDisplayFormat(timeline: any)`

**Expected Format**:
```typescript
{
  projectId: string;
  projectTitle: string;
  eventsCount: number;
  events: Array<{
    title: string;
    date: string;
    isMilestone: boolean;
  }>;
  message: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  timeline: {
    projectId: '123',
    projectTitle: 'My Project',
    eventsCount: 5,
    events: [{ title: 'Event 1', date: '2024-01-01', isMilestone: true }],
  },
  message: 'Timeline created successfully'
}
```

**Usage**:
```tsx
<TimelineVisualization timeline={apiResponse} />
```

---

### 4. QueryResults

**Purpose**: Displays database query results as table or chart.

**Transformation Function**: `mapQueryResultsToDisplayFormat(results: any)`

**Expected Format**:
```typescript
{
  query: string;
  sql: string;
  results: any[];
  visualization: string; // 'table' | 'chart' | 'graph'
  rowCount: number;
  message: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  queryResult: {
    query: 'Find all projects',
    sql: 'SELECT * FROM projects',
    results: [{ id: 1, name: 'Project 1' }],
    visualization: 'table',
    rowCount: 10,
  },
  message: 'Query executed successfully'
}
```

**Usage**:
```tsx
<QueryResults results={apiResponse} />
```

---

### 5. SearchResults

**Purpose**: Displays search results as interactive cards.

**Transformation Function**: `mapSearchResultsToDisplayFormat(results: any)`

**Expected Format**:
```typescript
{
  results: Array<{
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
    lastModified: string;
    relevanceScore: number;
  }>;
  count: number;
  query: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  searchResults: {
    results: [
      {
        id: '1',
        title: 'Note 1',
        excerpt: 'Preview text...',
        tags: ['tag1'],
        lastModified: '2024-01-01',
        relevanceScore: 0.95
      }
    ],
    count: 5,
    query: 'search term',
  },
  message: 'Search completed successfully'
}
```

**Usage**:
```tsx
<SearchResults results={apiResponse} />
```

---

### 6. ProjectPreview

**Purpose**: Shows project creation preview with confirmation.

**Transformation Function**: `mapProjectToDisplayFormat(project: any)`

**Expected Format**:
```typescript
{
  id: string;
  title: string;
  description: string;
  goalsCount: number;
  tasksCount: number;
  message: string;
}
```

**API Response Format**:
```typescript
{
  success: true,
  project: {
    id: '123',
    title: 'My Project',
    description: 'Project description...',
    goalsCount: 3,
    tasksCount: 10,
  },
  message: 'Project created successfully'
}
```

**Usage**:
```tsx
<ProjectPreview project={apiResponse} />
```

---

## Adding New Tool Visualizations

When creating a new tool visualization component, follow this pattern:

1. **Define the Props Interface**:
```typescript
interface MyToolVisualizationProps {
  data: {
    // Define exact structure your component needs
    field1: string;
    field2: number;
    // ...
  };
}
```

2. **Create the Transformation Function**:
```typescript
export function mapMyToolToDisplayFormat(data: any): MyToolVisualizationProps['data'] | null {
  // Handle null/undefined
  if (!data || data === undefined || data === null) {
    return null;
  }

  // Check if already in correct format
  if (data?.field1 && data?.field2 !== undefined) {
    return data;
  }

  // Handle nested API response
  if (data.myToolData) {
    return {
      field1: data.myToolData.field1,
      field2: data.myToolData.field2,
    };
  }

  // Fallback
  return {
    field1: data.field1 || 'default',
    field2: data.field2 || 0,
  };
}
```

3. **Use in Component**:
```typescript
export function MyToolVisualization({ data: rawData }: MyToolVisualizationProps) {
  const data = mapMyToolToDisplayFormat(rawData);

  if (!data) {
    return null; // or loading state
  }

  return (
    // Render component
  );
}
```

4. **Export from index.ts**:
```typescript
export { MyToolVisualization, mapMyToolToDisplayFormat } from './tools/MyToolVisualization';
```

## Benefits

- **Type Safety**: Clear interfaces for expected data structures
- **Flexibility**: Handles multiple input formats gracefully
- **Maintainability**: Centralized transformation logic
- **Testability**: Pure functions easy to unit test
- **Reusability**: Transformation functions can be used independently
- **Error Handling**: Graceful degradation with null checks

