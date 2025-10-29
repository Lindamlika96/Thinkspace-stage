/**
 * OpenAI Client Configuration for ThinkSpace
 *
 * This file provides OpenAI provider configuration using the AI SDK
 * for chat completions and AI-powered features in ThinkSpace.
 */

import { createOpenAI } from '@ai-sdk/openai';

// Initialize OpenAI provider with custom configuration
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  organization: process.env.OPENAI_ORGANIZATION,
  project: process.env.OPENAI_PROJECT,
});

// Default models from environment variables
export const DEFAULT_CHAT_MODEL = process.env.DEFAULT_CHAT_MODEL || 'gpt-4o-mini';
export const DEFAULT_EMBEDDING_MODEL = process.env.DEFAULT_EMBEDDING_MODEL || 'text-embedding-3-small';

/**
 * Generate chat completion using OpenAI language model
 * This function maintains backward compatibility with the old API while using the AI SDK
 */
export async function generateChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const { generateText: generateTextAI } = await import('ai');

  try {
    // Convert messages to a prompt format for generateText
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const prompt = userMessages.map(m => m.content).join('\n');
    const system = systemMessage?.content;

    const model = options?.model || DEFAULT_CHAT_MODEL;
    const response = await generateTextAI({
      model: openai(model),
      system,
      prompt,
      temperature: options?.temperature || 0.7,
      ...(options?.maxTokens && { maxTokens: options.maxTokens }),
    });

    // Return in OpenAI-compatible format for backward compatibility
    return {
      choices: [
        {
          message: {
            content: response.text,
            role: 'assistant',
          },
        },
      ],
      model,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error(`Failed to generate chat completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate text using OpenAI language model
 */
export async function generateText(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const { generateText: generateTextAI } = await import('ai');

  try {
    const response = await generateTextAI({
      model: openai(options?.model || DEFAULT_CHAT_MODEL),
      prompt,
      temperature: options?.temperature || 0.7,
      ...(options?.maxTokens && { maxTokens: options.maxTokens }),
    });

    return response;
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Stream text using OpenAI language model
 */
export async function streamText(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const { streamText: streamTextAI } = await import('ai');

  try {
    const result = streamTextAI({
      model: openai(options?.model || DEFAULT_CHAT_MODEL),
      prompt,
      temperature: options?.temperature || 0.7,
      ...(options?.maxTokens && { maxTokens: options.maxTokens }),
    });

    return result;
  } catch (error) {
    console.error('Error streaming text:', error);
    throw new Error(`Failed to stream text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create system message for PARA methodology context
 */
export function createSystemMessage(context?: {
  projectTitle?: string;
  areaTitle?: string;
  resourceTitle?: string;
  noteTitle?: string;
}): string {
  let systemContent = `You are an AI assistant for ThinkSpace, a PARA methodology-based knowledge management system.

The PARA method organizes information into:
- Projects: Things with a deadline and specific outcome
- Areas: Ongoing responsibilities to maintain over time
- Resources: Topics of ongoing interest for future reference
- Archive: Inactive items from the other categories

You help users manage their knowledge, make connections between ideas, and provide insights based on their PARA-organized content.`;

  if (context) {
    systemContent += '\n\nCurrent context:';
    if (context.projectTitle) systemContent += `\n- Project: ${context.projectTitle}`;
    if (context.areaTitle) systemContent += `\n- Area: ${context.areaTitle}`;
    if (context.resourceTitle) systemContent += `\n- Resource: ${context.resourceTitle}`;
    if (context.noteTitle) systemContent += `\n- Note: ${context.noteTitle}`;
  }

  return systemContent;
}


