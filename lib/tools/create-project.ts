/**
 * Create Project Tool Implementation
 * 
 * Creates a new project with goals and tasks.
 */

import prisma from '@/lib/prisma';

interface CreateProjectParams {
  title: string;
  description: string;
  goals: string[];
  tasks: Array<{ title: string; dueDate?: string }>;
  startDate?: string;
  dueDate?: string;
}

export async function createProjectTool(userId: string, params: CreateProjectParams) {
  try {
    const { title, description, goals, tasks, startDate, dueDate } = params;

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        metadata: {
          goals,
          createdByAI: true,
        },
      },
    });

    // Create associated tasks
    const createdTasks = await Promise.all(
      tasks.map((task) =>
        prisma.task.create({
          data: {
            title: task.title,
            projectId: project.id,
            userId,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          },
        })
      )
    );

    return {
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        goalsCount: goals.length,
        tasksCount: createdTasks.length,
      },
      message: `Project "${title}" created successfully with ${createdTasks.length} tasks`,
    };
  } catch (error) {
    console.error('Create project error:', error);
    return {
      success: false,
      error: 'Failed to create project',
    };
  }
}

