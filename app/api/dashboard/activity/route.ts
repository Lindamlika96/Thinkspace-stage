/**
 * Dashboard Activity API Route for ThinkSpace
 * 
 * This API provides recent activity data for the dashboard
 * including all user activities across projects, areas, resources, notes, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AppError, handleApiError } from '@/lib/utils';

// GET - Fetch recent activity
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch recent activities
    const activities = await prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        area: {
          select: {
            id: true,
            title: true,
          },
        },
        resource: {
          select: {
            id: true,
            title: true,
          },
        },
        note: {
          select: {
            id: true,
            title: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        file: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Transform activities to match the RecentActivity interface
    const recentActivity = activities.map((activity) => {
      let title = 'Unknown';
      let href = '/';
      let type: 'project' | 'area' | 'resource' | 'note' | 'chat' = 'project';

      if (activity.project) {
        title = activity.project.title;
        href = `/projects/${activity.project.id}`;
        type = 'project';
      } else if (activity.area) {
        title = activity.area.title;
        href = `/areas/${activity.area.id}`;
        type = 'area';
      } else if (activity.resource) {
        title = activity.resource.title;
        href = `/resources/${activity.resource.id}`;
        type = 'resource';
      } else if (activity.note) {
        title = activity.note.title;
        href = `/notes/${activity.note.id}`;
        type = 'note';
      } else if (activity.task) {
        title = activity.task.title;
        href = `/tasks/${activity.task.id}`;
        type = 'project'; // Tasks are part of projects
      } else if (activity.file) {
        title = activity.file.filename;
        href = `/resources`;
        type = 'resource';
      }

      // Format action text
      const actionText = activity.type.charAt(0).toUpperCase() + activity.type.slice(1).toLowerCase();

      return {
        id: activity.id,
        type,
        title,
        description: activity.description,
        action: actionText,
        timestamp: activity.createdAt,
        href,
      };
    });

    return NextResponse.json({
      success: true,
      activity: recentActivity,
    });

  } catch (error) {
    console.error('Get dashboard activity error:', error);
    const { message, statusCode } = handleApiError(error);
    
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: statusCode });
  }
}

