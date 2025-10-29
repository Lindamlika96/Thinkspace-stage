# ThinkSpace AI Chat UX Implementation Prompt for Coding Agent

## 🎯 Objective
Create an advanced AI-powered chat interface for "ThinkSpace" - a PARA-based knowledge management app. The chat should act as an intelligent assistant that can search notes, create content, visualize relationships, and manage your personal knowledge base using RAG and tool calling.

---

## 📋 Core Requirements

### Chat Interface Foundation

1. **Floating Chat Button**
   - Position: Fixed bottom-right (24px from bottom, 24px from right)
   - Style: Brain/lightbulb icon with subtle glow
   - Badge: Show notification dot when AI has suggestions
   - Animation: Pulse when there are unread suggestions
   - On hover: Scale (1.05x) with smooth transition

2. **Expandable Chat Panel**
   - Opens as slide-in panel from bottom-right
   - Dimensions:
     - Desktop: 450px width × 700px height
     - Tablet: 380px width × 600px height
     - Mobile: Full screen with safe areas
   - Animation: Smooth slide-up (300ms ease-out)
   - Modern, clean design (not mystical - professional productivity app)
   - Backdrop overlay on mobile

3. **Chat Header**
   - Title: "ThinkSpace AI Assistant"
   - Subtitle: Shows current context (e.g., "Searching in: Projects")
   - Actions:
     - Minimize button
     - Clear conversation (with confirmation)
     - PARA filter dropdown (Projects/Areas/Resources/Archives)
     - Settings (model selection, RAG settings)
   - Sticky when scrolling

---

## 🛠️ Advanced Features & Tool Calling

### AI Tools/Functions

The AI should have access to these tools via function calling:

#### 1. **Search Tool**
```typescript
{
  name: "search_notes",
  description: "Search through user's notes using semantic search",
  parameters: {
    query: string,
    paraFilter?: 'P' | 'A' | 'R' | 'A',
    limit?: number,
    dateRange?: { start: Date, end: Date }
  }
}
```

**UI Display:**
- Show "🔍 Searching notes..." indicator
- Display results as interactive cards
- Each result shows: title, excerpt, PARA category badge, last modified
- Click to open note in main view
- Option to "Add to context" for follow-up questions

#### 2. **Create Project Tool**
```typescript
{
  name: "create_project",
  description: "Create a new project with goals, tasks, and timeline",
  parameters: {
    title: string,
    description: string,
    goals: string[],
    tasks: Array<{ title: string, dueDate?: Date }>,
    timeline?: { start: Date, end: Date }
  }
}
```

**UI Display:**
- Show "📋 Creating project..." indicator
- Preview project structure before confirming
- Confirmation dialog: "Create project 'X' with Y tasks?"
- After creation: Show success with link to project
- Visual preview of timeline if provided

#### 3. **Create Timeline Tool**
```typescript
{
  name: "create_timeline",
  description: "Generate visual timeline for a project",
  parameters: {
    projectId: string,
    events: Array<{
      title: string,
      date: Date,
      description?: string,
      milestone?: boolean
    }>
  }
}
```

**UI Display:**
- Show "📅 Generating timeline..." indicator
- Render interactive timeline visualization inline in chat
- Horizontal timeline with milestones highlighted
- Clickable events that show details
- Export button (PNG, or add to note)

#### 4. **Create Mind Map Tool**
```typescript
{
  name: "create_mindmap",
  description: "Generate mind map for an area or concept",
  parameters: {
    centralTopic: string,
    nodes: Array<{
      id: string,
      label: string,
      parentId?: string,
      color?: string
    }>,
    areaId?: string
  }
}
```

**UI Display:**
- Show "🧠 Creating mind map..." indicator
- Render interactive mind map using React Flow or D3
- Expandable/collapsible nodes
- Click node to create linked note
- Save mind map as image or note
- Real-time layout adjustment

#### 5. **Link Notes Tool**
```typescript
{
  name: "link_notes",
  description: "Create bidirectional links between notes",
  parameters: {
    sourceNoteId: string,
    targetNoteId: string,
    linkType?: 'related' | 'supports' | 'contradicts' | 'extends'
  }
}
```

**UI Display:**
- Show "🔗 Creating link..." indicator
- Visual preview of link being created
- Shows both note titles with arrow between
- Confirmation: "Link 'Note A' → 'Note B'?"
- After creation: Show in knowledge graph

#### 6. **Draft Note Tool**
```typescript
{
  name: "draft_note",
  description: "Create a new note with RAG-enhanced content",
  parameters: {
    title: string,
    content: string,
    paraCategory: 'P' | 'A' | 'R' | 'A',
    tags?: string[],
    relatedNotes?: string[], // IDs of related notes
    sources?: string[] // Chat message IDs used as sources
  }
}
```

**UI Display:**
- Show "✍️ Drafting note..." indicator
- Live markdown preview as it's being generated
- Show RAG sources used at bottom
- Editable preview before saving
- Buttons: "Save", "Edit", "Cancel"
- After saving: Link to open note

#### 7. **Query Database Tool**
```typescript
{
  name: "query_database",
  description: "Run SQL queries for analytics and insights",
  parameters: {
    query: string,
    visualization?: 'table' | 'chart' | 'graph'
  }
}
```

**UI Display:**
- Show "📊 Querying database..." indicator
- Display SQL query in code block (syntax highlighted)
- Show results as formatted table or chart
- Support for: bar chart, line chart, pie chart, network graph
- Export results button (CSV, JSON)
- "Explain query" button

---

## 🎨 Message Display Components

### 1. **Tool Use Messages**

When AI decides to use a tool, show:

```
AI Message:
"I'll search your projects for information about that. One moment..."

[Tool Use Card]
┌─────────────────────────────────────────┐
│ 🔍 Searching Notes                       │
│ Query: "machine learning projects"      │
│ Filter: Projects only                    │
│ [Spinner/Progress bar]                   │
└─────────────────────────────────────────┘
```

### 2. **Tool Result Messages**

Display results inline:

```
[Search Results Card]
┌─────────────────────────────────────────┐
│ 🔍 Found 5 notes                         │
│                                          │
│ 📄 ML Fundamentals Course               │
│    "Notes from deep learning..."        │
│    🏷️ Projects | 📅 2 days ago           │
│    [Open] [Add to Context]              │
│                                          │
│ 📄 Neural Network Implementation        │
│    "Built a simple neural net..."       │
│    🏷️ Projects | 📅 1 week ago           │
│    [Open] [Add to Context]              │
│                                          │
│ [Show all 5 results]                    │
└─────────────────────────────────────────┘
```

### 3. **Inline Visualizations**

Render visualizations directly in chat:

```
[Timeline Visualization]
┌─────────────────────────────────────────┐
│ 📅 Project Timeline: Website Redesign   │
│                                          │
│ Jan ──●─────────●──────────●─── Mar    │
│     Kickoff  Design  Development        │
│                                          │
│ [Edit Timeline] [Add to Note]           │
└─────────────────────────────────────────┘
```

### 4. **Confirmation Dialogs**

For destructive or important actions:

```
[Confirmation Card]
┌─────────────────────────────────────────┐
│ ⚠️ Confirm Action                        │
│                                          │
│ Create new project "AI Research"?       │
│                                          │
│ • 5 goals defined                       │
│ • 12 tasks created                      │
│ • 3-month timeline                      │
│                                          │
│ [Cancel] [Create Project] ✨            │
└─────────────────────────────────────────┘
```

### 5. **Citation Sources**

Show RAG sources for note drafting:

```
AI Message:
"I've drafted a comprehensive note about..."

[Draft Preview Card]
┌─────────────────────────────────────────┐
│ ✍️ Draft: "Understanding RAG Systems"   │
│                                          │
│ [Markdown Preview]                       │
│                                          │
│ 📚 Sources Used:                         │
│ • Vector Databases (from Areas)         │
│ • LLM Integration (from Resources)      │
│ • Project: AI Assistant (from Projects) │
│                                          │
│ [Edit] [Save to Projects] [Discard]    │
└─────────────────────────────────────────┘
```

---

## 💬 Chat Input Enhancements

### 1. **Context Selector**
Above input field, show chips for:
- Current PARA filter: `[Projects ▼]` `[Areas]` `[Resources]` `[Archives]`
- Active note context: `[📄 Current Note: "AI Notes"] ✕`
- Selected notes: `[+2 notes in context]`

### 2. **Smart Input**
- **Slash Commands**: Type `/` to see available tools
  ```
  /search - Search notes
  /project - Create project
  /timeline - Generate timeline
  /mindmap - Create mind map
  /link - Link notes
  /draft - Draft new note
  /query - Query database
  ```
- **@ Mentions**: Type `@` to reference specific notes
  ```
  @note-title - Include note in context
  @project/name - Reference project
  ```
- **# Tags**: Type `#` to add tags or filter
  ```
  #machine-learning - Add tag context
  #Projects - Filter to projects
  ```

### 3. **Suggested Actions**
Show contextual quick actions based on:
- Current page (viewing a project → suggest timeline)
- Recent activity (created many notes → suggest mind map)
- Time-based (Monday → suggest weekly review)

Example chips:
```
[📊 Analyze my projects] [🧠 Create mind map] [📅 Week review]
```

---

## 🗂️ PARA Integration

### PARA Filter UI

In chat header, prominent filter:

```
┌─────────────────────────────────┐
│ Search in: [All ▼]              │
│   ✓ Projects                    │
│   ✓ Areas                       │
│   ✓ Resources                   │
│   □ Archives (disabled)         │
└─────────────────────────────────┘
```

### PARA Badges

Every search result, citation, and created content shows PARA category:

```
🎯 Projects   | 🎨 Areas
📚 Resources  | 📦 Archives
```

Use distinct colors:
- Projects: Blue
- Areas: Green  
- Resources: Purple
- Archives: Gray

---

## 🎯 Technical Implementation

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Vector DB**: Supabase pgvector
- **AI SDK**: Vercel AI SDK with tool calling
- **UI**: Tailwind CSS + Radix UI or shadcn/ui
- **Visualizations**: 
  - React Flow (mind maps)
  - Recharts (timelines, charts)
  - D3.js (complex visualizations)
- **Markdown**: react-markdown with remark-gfm
- **Code**: Shiki for syntax highlighting

### Database Schema

```sql
-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  para_category VARCHAR(1) CHECK (para_category IN ('P', 'A', 'R', 'A')),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

-- Note links table
CREATE TABLE note_links (
  id UUID PRIMARY KEY,
  source_note_id UUID REFERENCES notes(id),
  target_note_id UUID REFERENCES notes(id),
  link_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT[],
  timeline JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mind maps table
CREATE TABLE mindmaps (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  data JSONB, -- Stores nodes and edges
  area_id UUID REFERENCES notes(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Route Structure

```typescript
// app/api/chat/route.ts
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { searchNotes, createProject, draftNote } from '@/lib/tools';

export async function POST(req: Request) {
  const { messages, paraFilter } = await req.json();
  
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools: {
      search_notes: tool({
        description: 'Search through notes',
        parameters: z.object({
          query: z.string(),
          paraFilter: z.enum(['P', 'A', 'R', 'A']).optional(),
          limit: z.number().optional()
        }),
        execute: async (params) => {
          return await searchNotes(params, userId);
        }
      }),
      
      create_project: tool({
        description: 'Create a new project',
        parameters: z.object({
          title: z.string(),
          description: z.string(),
          goals: z.array(z.string()),
          tasks: z.array(z.object({
            title: z.string(),
            dueDate: z.string().optional()
          }))
        }),
        execute: async (params) => {
          return await createProject(params, userId);
        }
      }),
      
      draft_note: tool({
        description: 'Draft a new note using RAG',
        parameters: z.object({
          title: z.string(),
          topic: z.string(),
          paraCategory: z.enum(['P', 'A', 'R', 'A']),
          relatedNoteIds: z.array(z.string()).optional()
        }),
        execute: async (params) => {
          // 1. Search for relevant context
          const context = await ragSearch(params.topic, userId);
          
          // 2. Generate note content
          const content = await generateNoteContent(params, context);
          
          // 3. Return draft with sources
          return {
            title: params.title,
            content,
            sources: context.sources,
            paraCategory: params.paraCategory
          };
        }
      }),
      
      query_database: tool({
        description: 'Query the database for insights',
        parameters: z.object({
          query: z.string().describe('Natural language query'),
          visualization: z.enum(['table', 'chart', 'graph']).optional()
        }),
        execute: async (params) => {
          // Convert natural language to SQL
          const sql = await generateSQL(params.query);
          
          // Execute query
          const results = await db.query(sql);
          
          return {
            sql,
            results,
            visualization: params.visualization
          };
        }
      }),
      
      // Additional tools: create_timeline, create_mindmap, link_notes
    }
  });
  
  return result.toDataStreamResponse();
}
```

### Component Structure

```
components/
├── chat/
│   ├── ThinkSpaceChat.tsx          # Main container
│   ├── ChatButton.tsx              # Floating button
│   ├── ChatPanel.tsx               # Expandable panel
│   ├── ChatHeader.tsx              # Header with PARA filter
│   ├── ChatMessages.tsx            # Message list
│   ├── ChatMessage.tsx             # Individual message
│   ├── ChatInput.tsx               # Enhanced input
│   ├── ContextSelector.tsx         # PARA + note context
│   ├── SlashCommands.tsx           # Command palette
│   └── tools/
│       ├── ToolUseIndicator.tsx    # Loading states
│       ├── SearchResults.tsx       # Search tool UI
│       ├── ProjectPreview.tsx      # Project creation UI
│       ├── TimelineVisualization.tsx
│       ├── MindMapVisualization.tsx
│       ├── NoteLink.tsx            # Link creation UI
│       ├── NoteDraft.tsx           # Draft preview
│       └── QueryResults.tsx        # SQL results display
├── visualizations/
│   ├── Timeline.tsx                # Reusable timeline
│   ├── MindMap.tsx                 # Reusable mind map
│   └── DataChart.tsx               # Reusable charts
└── ui/
    ├── Badge.tsx                   # PARA badges
    ├── Card.tsx                    # Result cards
    └── ConfirmDialog.tsx           # Confirmations
```

---

## 🎨 Design System

### Colors (Light/Dark Mode)

**PARA Categories:**
- Projects: `bg-blue-100 text-blue-700` / `bg-blue-900 text-blue-300`
- Areas: `bg-green-100 text-green-700` / `bg-green-900 text-green-300`
- Resources: `bg-purple-100 text-purple-700` / `bg-purple-900 text-purple-300`
- Archives: `bg-gray-100 text-gray-600` / `bg-gray-800 text-gray-400`

**Tool Indicators:**
- Search: Blue
- Create: Green
- Link: Purple
- Query: Orange

### Typography
- Headers: Inter or SF Pro (system)
- Body: Same as notes editor
- Code: JetBrains Mono or Fira Code

### Spacing
- Chat padding: 20px
- Message spacing: 16px
- Card padding: 16px
- Compact spacing in tool results: 12px

---

## ✅ Acceptance Criteria

### Core Chat
- [ ] Chat opens/closes smoothly
- [ ] Messages stream in real-time
- [ ] RAG sources are displayed with citations
- [ ] PARA filter works correctly
- [ ] Mobile responsive

### Tool Calling
- [ ] All 7 tools work correctly
- [ ] Tool loading states are clear
- [ ] Tool results display properly
- [ ] Confirmations work for important actions
- [ ] Error handling for failed tools

### Visualizations
- [ ] Timelines render and are interactive
- [ ] Mind maps render and are interactive
- [ ] Charts display SQL query results
- [ ] All visualizations are responsive

### Input Enhancements
- [ ] Slash commands work
- [ ] @ mentions work
- [ ] # tags work
- [ ] Context selector updates correctly

### Database Integration
- [ ] Notes are searched via RAG
- [ ] Projects are created in DB
- [ ] Links are stored bidirectionally
- [ ] SQL queries execute safely

---

## 🚀 Implementation Priority

**Phase 1 (Core Chat + RAG):**
1. Basic chat UI with PARA filter
2. RAG-powered search tool
3. Citation display
4. Note draft tool

**Phase 2 (Content Creation):**
1. Create project tool
2. Link notes tool
3. Confirmation dialogs

**Phase 3 (Visualizations):**
1. Timeline visualization
2. Mind map visualization
3. Query results display

**Phase 4 (Polish):**
1. Slash commands
2. @ mentions and # tags
3. Context management
4. Advanced animations

---

## 💡 Additional Requirements

### Security
- Validate all SQL queries (prevent injection)
- User isolation (can only access own notes)
- Rate limiting on expensive operations
- Sanitize all user inputs

### Performance
- Lazy load visualizations
- Cache search results (5 minutes)
- Debounce search input
- Optimize RAG queries
- Limit message history (last 20 messages)

### Analytics
- Track tool usage
- Monitor RAG quality
- Log failed operations
- Measure response times

### Accessibility
- Keyboard shortcuts for all tools
- Screen reader support
- Focus management
- ARIA labels on all interactive elements

---

## 📦 Deliverables

1. All chat components (TypeScript)
2. Tool implementation functions
3. Visualization components
4. Database queries and migrations
5. API route with all tools
6. Documentation on adding new tools
7. Example SQL queries for analytics

This is a sophisticated AI assistant that truly augments your knowledge management workflow! 🚀