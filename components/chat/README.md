# ThinkSpace AI Chat Component

Complete AI-powered chat interface for ThinkSpace using Vercel AI SDK with tool calling support.

## Architecture

### Client-Side (Vercel AI SDK `useChat` hook)

The chat interface uses the `useChat` hook from `ai/react` for:
- Message state management
- Streaming response handling
- Tool call execution and results
- Loading states and error handling

### Server-Side (Vercel AI SDK `streamText`)

The API route (`/api/chat/stream`) uses `streamText` for:
- Streaming AI responses
- Tool definition and execution
- Zod schema validation for tool parameters
- Data stream response formatting

## Components

### Core Components

- **ThinkSpaceChat**: Main container managing open/close state
- **ChatButton**: Fixed floating button with notification badge
- **ChatPanel**: Expandable slide-in panel with responsive design
- **ChatHeader**: Header with PARA filter and settings
- **ChatMessages**: Message list with auto-scroll
- **ChatMessage**: Individual message with tool result rendering
- **ChatInput**: Enhanced input with context selector
- **ContextSelector**: PARA category and note context chips
- **ParaFilter**: Dropdown for filtering by PARA category

### Tool Components

- **ToolUseIndicator**: Loading state when AI uses a tool
- **SearchResults**: Search results as interactive cards
- **ProjectPreview**: Project creation preview with confirmation
- **NoteDraft**: Note draft with markdown preview
- **TimelineVisualization**: Interactive timeline display
- **MindMapVisualization**: Mind map visualization
- **QueryResults**: Database query results as table/chart

## Tool Implementation

### Available Tools

1. **search_notes**: Semantic search through user notes
2. **create_project**: Create new project with goals and tasks
3. **draft_note**: Draft new note with RAG-enhanced content
4. **link_notes**: Create bidirectional links between notes
5. **create_timeline**: Generate project timeline
6. **create_mindmap**: Generate mind map for concepts
7. **query_database**: Execute database queries for analytics

### Tool Execution Flow

```
User Message
    ↓
useChat hook sends to /api/chat/stream
    ↓
streamText processes with tools
    ↓
AI decides to use tool
    ↓
Tool function executes (lib/tools/*)
    ↓
Result streamed back to client
    ↓
ChatMessage renders appropriate component
```

## Usage

### Basic Integration

```tsx
import { ThinkSpaceChat } from '@/components/chat';

export default function Layout() {
  return (
    <>
      {/* Your app content */}
      <ThinkSpaceChat />
    </>
  );
}
```

### Using useChat Hook

```tsx
import { useChat } from 'ai/react';

function MyComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat/stream',
  });

  return (
    // Your component JSX
  );
}
```

## Configuration

### Environment Variables

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_CHAT_MODEL=gpt-4-turbo
```

### Mantine Theme Integration

The chat components use Mantine's theme system for colors and responsive design:
- PARA colors: Blue (Projects), Green (Areas), Purple (Resources), Gray (Archives)
- Responsive breakpoints for mobile/tablet/desktop
- Dark mode support via Mantine's color scheme

## Styling

### CSS Modules

- `ChatButton.module.css`: Button animations and pulse effect
- `ChatPanel.module.css`: Panel slide-in animation and responsive layout

### Mantine Components

All components use Mantine UI components for consistency:
- Paper, Stack, Group for layout
- ActionIcon, Button for interactions
- Badge, Chip for tags and filters
- Modal for confirmations
- Textarea for input

## Performance Optimizations

1. **Lazy Loading**: Components mounted only when needed
2. **Message Caching**: Search results cached for 5 minutes
3. **Debounced Input**: Search input debounced to reduce API calls
4. **Virtualized Lists**: Large message lists use virtualization
5. **Code Splitting**: Tool components lazy loaded

## Security

1. **User Isolation**: All queries filtered by userId
2. **SQL Injection Prevention**: Parameterized queries via Prisma
3. **Input Sanitization**: All user inputs validated with Zod
4. **Rate Limiting**: Tool execution rate limited per user
5. **Authentication**: All routes require valid session

## Adding New Tools

1. Create tool function in `lib/tools/your-tool.ts`
2. Add tool definition to `/api/chat/stream/route.ts`
3. Create UI component in `components/chat/tools/YourTool.tsx`
4. Add rendering logic to `ChatMessage.tsx`

Example:

```typescript
// lib/tools/your-tool.ts
export async function yourToolFunction(userId: string, params: YourParams) {
  // Implementation
  return { success: true, data: {} };
}

// In /api/chat/stream/route.ts
your_tool: tool({
  description: 'Your tool description',
  parameters: z.object({ /* params */ }),
  execute: async (params) => {
    return await yourToolFunction(user.id, params);
  },
}),
```

## Testing

Run tests with:

```bash
pnpm test
```

Test coverage includes:
- Component rendering
- Tool execution
- Message streaming
- Error handling
- User isolation

## Troubleshooting

### Messages not streaming
- Check API route is accessible at `/api/chat/stream`
- Verify OpenRouter API key is set
- Check browser console for errors

### Tool not executing
- Verify tool parameters match Zod schema
- Check tool function implementation
- Review server logs for errors

### Styling issues
- Ensure Mantine provider is in layout
- Check CSS module imports
- Verify theme configuration

## Future Enhancements

- [ ] Slash commands for quick actions
- [ ] @ mentions for note references
- [ ] # tags for filtering
- [ ] Suggested actions based on context
- [ ] Citation sources display
- [ ] Advanced animations
- [ ] Voice input support
- [ ] Export chat history

