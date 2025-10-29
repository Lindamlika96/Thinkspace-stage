/**
 * Chat Messages API Routes for ThinkSpace
 * 
 * This API handles chat message operations including sending messages,
 * receiving AI responses, and managing conversation history.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AppError, handleApiError } from '@/lib/utils';
import { generateChatCompletion, createSystemMessage, DEFAULT_CHAT_MODEL } from '@/lib/openai';

// Message validation schema
const createMessageSchema = z.object({
  content: z.string()
    .min(1, 'Message content is required')
    .max(4000, 'Message content must be less than 4000 characters')
    .trim(),
  role: z.enum(['USER', 'ASSISTANT', 'SYSTEM']).optional().default('USER'),
  metadata: z.record(z.string(), z.any()).optional(),
});

interface RouteParams {
  params: Promise<{
    chatId: string;
  }>;
}

// GET - List messages for a chat
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const { chatId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const skip = (page - 1) * limit;

    // Verify chat ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Get messages with pagination
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          chatId,
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.message.count({
        where: {
          chatId,
          userId: session.user.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });

  } catch (error) {
    console.error('Get messages error:', error);
    const { message, statusCode } = handleApiError(error);
    
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: statusCode });
  }
}

// POST - Send message and get AI response
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const { chatId } = await params;
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Verify chat ownership and get context
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
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
      },
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content: validatedData.content,
        role: validatedData.role,
        metadata: (validatedData.metadata || {}) as any,
        userId: session.user.id,
        chatId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent conversation history for context
    const recentMessages = await prisma.message.findMany({
      where: {
        chatId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Last 10 messages for context
    });

    // Prepare messages for AI (reverse to chronological order)
    const conversationHistory = recentMessages.reverse();
    
    // Create system message with PARA context
    const systemMessage = createSystemMessage({
      projectTitle: chat.project?.title,
      areaTitle: chat.area?.title,
      resourceTitle: chat.resource?.title,
      noteTitle: chat.note?.title,
    });

    // Convert to message format
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.map(msg => ({
        role: msg.role.toLowerCase(),
        content: msg.content,
      })),
    ];

    // Generate AI response
    const aiResponse = await generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 2000,
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new AppError('Failed to generate AI response', 500);
    }

    // Save AI response
    const aiMessage = await prisma.message.create({
      data: {
        content: aiContent,
        role: 'ASSISTANT',
        metadata: {
          model: aiResponse.model || DEFAULT_CHAT_MODEL,
          usage: aiResponse.usage,
        },
        userId: session.user.id,
        chatId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update chat timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: {
        userMessage,
        aiMessage,
      },
      message: 'Messages sent successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc: Record<string, string>, err) => {
        const field = err.path.join('.');
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: fieldErrors,
      }, { status: 400 });
    }

    const { message, statusCode } = handleApiError(error);
    
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: statusCode });
  }
}
