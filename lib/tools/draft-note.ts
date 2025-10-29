/**
 * Draft Note Tool Implementation
 * 
 * Creates a new note with RAG-enhanced content.
 */

import prisma from '@/lib/prisma';

interface DraftNoteParams {
  title: string;
  content: string;
  paraCategory: 'P' | 'A' | 'R' | 'A';
  tags?: string[];
  relatedNoteIds?: string[];
}

export async function draftNoteTool(userId: string, params: DraftNoteParams) {
  try {
    const { title, content, paraCategory, tags = [], relatedNoteIds = [] } = params;

    // Map PARA category to tag
    const categoryTag = paraCategory === 'P' ? 'project' : paraCategory === 'A' ? 'area' : paraCategory === 'R' ? 'resource' : 'archive';

    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        tags: [categoryTag, ...tags],
        metadata: {
          createdByAI: true,
          sources: relatedNoteIds,
        },
      },
    });

    // Create connections to related notes
    if (relatedNoteIds.length > 0) {
      await Promise.all(
        relatedNoteIds.map((relatedId) =>
          prisma.connection.create({
            data: {
              userId,
              sourceNoteId: note.id,
              targetNoteId: relatedId,
              linkType: 'RELATED',
              createdBy: 'AI_SUGGESTED',
            },
          }).catch(() => null) // Ignore errors for invalid IDs
        )
      );
    }

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title,
        preview: content.substring(0, 150),
        tags: note.tags,
        category: paraCategory,
      },
      message: `Note "${title}" drafted successfully`,
    };
  } catch (error) {
    console.error('Draft note error:', error);
    return {
      success: false,
      error: 'Failed to draft note',
    };
  }
}

