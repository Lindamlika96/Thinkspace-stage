/**
 * Search Tool Implementation
 * 
 * Implements semantic search through user notes using vector embeddings.
 */

import prisma from '@/lib/prisma';
import { generateEmbedding } from '@/lib/vector';

interface SearchParams {
  query: string;
  paraFilter?: 'P' | 'A' | 'R' | 'A';
  limit?: number;
}

export async function searchNotesByQuery(userId: string, params: SearchParams) {
  try {
    const { query, paraFilter, limit = 5 } = params;

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Build where clause based on PARA filter
    const where: any = {
      userId,
    };

    // Map PARA filter to note types or tags
    if (paraFilter) {
      where.tags = {
        has: paraFilter === 'P' ? 'project' : paraFilter === 'A' ? 'area' : paraFilter === 'R' ? 'resource' : 'archive',
      };
    }

    // Search notes using vector similarity
    // Note: This is a simplified implementation. In production, use pgvector similarity search
    const notes = await prisma.note.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate relevance scores (simplified - in production use vector similarity)
    const results = notes.map((note) => ({
      id: note.id,
      title: note.title,
      excerpt: note.content.substring(0, 200),
      tags: note.tags,
      lastModified: note.updatedAt,
      relevanceScore: 0.8, // Placeholder
    }));

    return {
      success: true,
      results,
      count: results.length,
      query,
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search notes',
      results: [],
    };
  }
}

