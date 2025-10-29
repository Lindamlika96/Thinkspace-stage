/**
 * Chat Types and Interfaces
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  lastModified: Date;
  relevanceScore: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  goals: string[];
  tasks: Array<{ title: string; dueDate?: Date }>;
  startDate?: Date;
  dueDate?: Date;
}

export interface TimelineEvent {
  title: string;
  date: Date;
  description?: string;
  milestone?: boolean;
}

export interface MindmapNode {
  id: string;
  label: string;
  parentId?: string;
  color?: string;
}

export interface QueryResult {
  sql: string;
  results: any[];
  visualization: 'table' | 'chart' | 'graph';
  rowCount: number;
}

export interface ParaFilter {
  projects: boolean;
  areas: boolean;
  resources: boolean;
  archives: boolean;
}

