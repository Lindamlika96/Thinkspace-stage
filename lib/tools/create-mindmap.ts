/**
 * Create Mindmap Tool Implementation
 * 
 * Generates mind map for an area or concept.
 */

import prisma from '@/lib/prisma';

interface MindmapNode {
  id: string;
  label: string;
  parentId?: string;
  color?: string;
}

interface CreateMindmapParams {
  centralTopic: string;
  nodes: MindmapNode[];
  areaId?: string;
}

export async function createMindmapTool(userId: string, params: CreateMindmapParams) {
  try {
    const { centralTopic, nodes, areaId } = params;

    // Verify area exists if provided
    if (areaId) {
      const area = await prisma.area.findUnique({
        where: { id: areaId },
      });

      if (!area || area.userId !== userId) {
        return {
          success: false,
          error: 'Area not found or unauthorized',
        };
      }
    }

    // Create mindmap record
    const mindmap = await prisma.graphSnapshot.create({
      data: {
        userId,
        title: centralTopic,
        description: `Mind map for ${centralTopic}`,
        data: JSON.parse(JSON.stringify({
          centralTopic,
          nodes,
          createdByAI: true,
          areaId,
        })),
      },
    });

    return {
      success: true,
      mindmap: {
        id: mindmap.id,
        title: centralTopic,
        nodesCount: nodes.length,
        nodes: nodes.map((n) => ({
          id: n.id,
          label: n.label,
          color: n.color || '#228be6',
        })),
      },
      message: `Mind map "${centralTopic}" created with ${nodes.length} nodes`,
    };
  } catch (error) {
    console.error('Create mindmap error:', error);
    return {
      success: false,
      error: 'Failed to create mind map',
    };
  }
}

