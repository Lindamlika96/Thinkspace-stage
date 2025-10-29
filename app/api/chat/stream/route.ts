/**
 * ThinkSpace AI Chat Streaming API Route
 * 
 * Handles streaming chat responses with tool calling support using Vercel AI SDK.
 * Implements RAG-powered search, project creation, note drafting, and more.
 */

import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from 'ai';
import { openai } from '@/lib/openai';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { searchNotesByQuery } from '@/lib/tools/search';
import { createProjectTool } from '@/lib/tools/create-project';
import { draftNoteTool } from '@/lib/tools/draft-note';
import { linkNotesTool } from '@/lib/tools/link-notes';
import { createTimelineTool } from '@/lib/tools/create-timeline';
import { createMindmapTool } from '@/lib/tools/create-mindmap';
import { queryDatabaseTool } from '@/lib/tools/query-database';


export type ChatTools = InferUITools<ToolSet>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {


  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }


    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const tools = {
      search_notes: tool({
        description: 'Search through user notes using semantic search',
        inputSchema: z.object({
          query: z.string().describe('Search query'),
          paraFilter: z.enum(['P', 'A', 'R', 'A']).optional().describe('Filter by PARA category'),
          limit: z.number().optional().default(5).describe('Number of results to return'),
        }),
        execute: async (params) => {
          return await searchNotesByQuery(user.id, params);
        },
      }),

      create_project: tool({
        description: 'Create a new project with goals and tasks',
        inputSchema: z.object({
          title: z.string().describe('Project title'),
          description: z.string().describe('Project description'),
          goals: z.array(z.string()).describe('Project goals'),
          tasks: z.array(z.object({
            title: z.string(),
            dueDate: z.string().optional(),
          })).describe('Initial tasks'),
          startDate: z.string().optional(),
          dueDate: z.string().optional(),
        }),
        execute: async (params) => {
          return await createProjectTool(user.id, params);
        },
      }),

      draft_note: tool({
        description: 'Draft a new note with RAG-enhanced content',
        inputSchema: z.object({
          title: z.string().describe('Note title'),
          content: z.string().describe('Note content'),
          paraCategory: z.enum(['P', 'A', 'R', 'A']).describe('PARA category'),
          tags: z.array(z.string()).optional().describe('Tags for the note'),
          relatedNoteIds: z.array(z.string()).optional().describe('Related note IDs'),
        }),
        execute: async (params) => {
          return await draftNoteTool(user.id, params);
        },
      }),

      link_notes: tool({
        description: 'Create bidirectional links between notes',
        inputSchema: z.object({
          sourceNoteId: z.string().describe('Source note ID'),
          targetNoteId: z.string().describe('Target note ID'),
          linkType: z.enum(['related', 'supports', 'contradicts', 'extends']).optional().describe('Type of link'),
        }),
        execute: async (params) => {
          return await linkNotesTool(user.id, params);
        },
      }),

      create_timeline: tool({
        description: 'Generate visual timeline for a project',
        inputSchema: z.object({
          projectId: z.string().describe('Project ID'),
          events: z.array(z.object({
            title: z.string(),
            date: z.string(),
            description: z.string().optional(),
            milestone: z.boolean().optional(),
          })).describe('Timeline events'),
        }),
        execute: async (params) => {
          return await createTimelineTool(user.id, params);
        },
      }),

      create_mindmap: tool({
        description: 'Generate mind map for an area or concept',
        inputSchema: z.object({
          centralTopic: z.string().describe('Central topic'),
          nodes: z.array(z.object({
            id: z.string(),
            label: z.string(),
            parentId: z.string().optional(),
            color: z.string().optional(),
          })).describe('Mind map nodes'),
          areaId: z.string().optional().describe('Related area ID'),
        }),
        execute: async (params) => {
          return await createMindmapTool(user.id, params);
        },
      }),

      query_database: tool({
        description: 'Query database for analytics and insights',
        inputSchema: z.object({
          query: z.string().describe('Natural language query'),
          visualization: z.enum(['table', 'chart', 'graph']).optional().describe('Visualization type'),
        }),
        execute: async (params) => {
          return await queryDatabaseTool(user.id, params);
        },
      }),
    }
    const { messages, paraFilter }: { messages: UIMessage[], paraFilter: any } = await req.json();
    console.log("🚀 ~ file: route.ts:77 ~ POST ~ messages:", messages)
    const system: string = `You are ThinkSpace AI Assistant, an intelligent knowledge management assistant for the PARA methodology.
      
  The PARA method organizes information into:
  - Projects (P): Things with a deadline and specific outcome
  - Areas (A): Ongoing responsibilities to maintain over time
  - Resources (R): Topics of ongoing interest for future reference
  - Archive: Inactive items from other categories
  
  You help users search their knowledge base, create projects, draft notes, link ideas, and visualize their knowledge.
  When users ask questions, use the search_notes tool to find relevant information.
  When they want to create something, use the appropriate creation tool.
  Be concise and helpful. Always cite sources when using search results.
  ${paraFilter ? `Current PARA filter: ${paraFilter}` : ''}`;
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system,
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

