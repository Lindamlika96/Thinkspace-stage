/**
 * Link Notes Tool Implementation
 * 
 * Creates bidirectional links between notes.
 */

import prisma from '@/lib/prisma';

interface LinkNotesParams {
  sourceNoteId: string;
  targetNoteId: string;
  linkType?: 'related' | 'supports' | 'contradicts' | 'extends';
}

export async function linkNotesTool(userId: string, params: LinkNotesParams) {
  try {
    const { sourceNoteId, targetNoteId, linkType = 'related' } = params;

    // Verify both notes exist and belong to user
    const [sourceNote, targetNote] = await Promise.all([
      prisma.note.findUnique({ where: { id: sourceNoteId } }),
      prisma.note.findUnique({ where: { id: targetNoteId } }),
    ]);

    if (!sourceNote || !targetNote) {
      return {
        success: false,
        error: 'One or both notes not found',
      };
    }

    if (sourceNote.userId !== userId || targetNote.userId !== userId) {
      return {
        success: false,
        error: 'Unauthorized: notes do not belong to user',
      };
    }

    // Create bidirectional connection
    const connection = await prisma.connection.create({
      data: {
        userId,
        sourceNoteId,
        targetNoteId,
        linkType: linkType.toUpperCase(),
        bidirectional: true,
        createdBy: 'AI_SUGGESTED',
      },
    });

    return {
      success: true,
      link: {
        id: connection.id,
        sourceTitle: sourceNote.title,
        targetTitle: targetNote.title,
        linkType,
      },
      message: `Linked "${sourceNote.title}" → "${targetNote.title}"`,
    };
  } catch (error) {
    console.error('Link notes error:', error);
    return {
      success: false,
      error: 'Failed to create link',
    };
  }
}

