/**
 * Query Database Tool Implementation
 * 
 * Executes database queries for analytics and insights.
 */

import prisma from '@/lib/prisma';

interface QueryDatabaseParams {
  query: string;
  visualization?: 'table' | 'chart' | 'graph';
}

export async function queryDatabaseTool(userId: string, params: QueryDatabaseParams) {
  try {
    const { query, visualization = 'table' } = params;

    // Parse natural language query and execute appropriate database query
    // This is a simplified implementation - in production, use NL-to-SQL conversion

    let results: any = [];
    let sql = '';

    // Example queries
    if (query.toLowerCase().includes('project') && query.toLowerCase().includes('count')) {
      sql = 'SELECT COUNT(*) as count FROM projects WHERE user_id = $1';
      const projectCount = await prisma.project.count({ where: { userId } });
      results = [{ count: projectCount }];
    } else if (query.toLowerCase().includes('task') && query.toLowerCase().includes('status')) {
      sql = 'SELECT status, COUNT(*) as count FROM tasks WHERE user_id = $1 GROUP BY status';
      const tasks = await prisma.task.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      });
      results = tasks.map((t) => ({
        status: t.status,
        count: t._count,
      }));
    } else if (query.toLowerCase().includes('note') && query.toLowerCase().includes('count')) {
      sql = 'SELECT COUNT(*) as count FROM notes WHERE user_id = $1';
      const noteCount = await prisma.note.count({ where: { userId } });
      results = [{ count: noteCount }];
    } else if (query.toLowerCase().includes('recent')) {
      sql = 'SELECT title, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10';
      const recentProjects = await prisma.project.findMany({
        where: { userId },
        select: { title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      results = recentProjects;
    } else {
      return {
        success: false,
        error: 'Query not supported. Try: "count projects", "task status", "recent projects"',
      };
    }

    return {
      success: true,
      query,
      sql,
      results,
      visualization,
      rowCount: results.length,
      message: `Query executed successfully. Found ${results.length} results.`,
    };
  } catch (error) {
    console.error('Query database error:', error);
    return {
      success: false,
      error: 'Failed to execute query',
    };
  }
}

