/**
 * Create Timeline Tool Implementation
 * 
 * Generates visual timeline for a project.
 */

import prisma from '@/lib/prisma';

interface TimelineEvent {
  title: string;
  date: string;
  description?: string;
  milestone?: boolean;
}

interface CreateTimelineParams {
  projectId: string;
  events: TimelineEvent[];
}

export async function createTimelineTool(userId: string, params: CreateTimelineParams) {
  try {
    const { projectId, events } = params;

    // Verify project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return {
        success: false,
        error: 'Project not found or unauthorized',
      };
    }

    // Store timeline data in project metadata
    const timelineData = {
      events: events.map((e) => ({
        ...e,
        date: new Date(e.date),
      })),
      createdAt: new Date(),
      createdByAI: true,
    };

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        metadata: {
          ...(project.metadata as Record<string, unknown> || {}),
          timeline: timelineData,
        },
      },
    });

    return {
      success: true,
      timeline: {
        projectId,
        projectTitle: project.title,
        eventsCount: events.length,
        events: events.map((e) => ({
          title: e.title,
          date: e.date,
          isMilestone: e.milestone || false,
        })),
      },
      message: `Timeline created with ${events.length} events`,
    };
  } catch (error) {
    console.error('Create timeline error:', error);
    return {
      success: false,
      error: 'Failed to create timeline',
    };
  }
}

