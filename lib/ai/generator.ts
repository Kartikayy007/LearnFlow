import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, createUserPrompt } from './prompts';
import { langfuse } from '../tracing/langfuse';

let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function generateLesson(outline: string, modelType: 'smart' | 'fast' = 'smart'): Promise<{ content: string; title: string }> {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.');
  }

  const trace = langfuse?.trace({
    name: 'lesson-generation-workflow',
    metadata: { outline, modelType },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let generation: any = null;

  try {
    const modelName = modelType === 'smart' ? 'gemini-2.5-flash' : 'gemini-1.5-flash';
    const userPrompt = createUserPrompt(outline);

    generation = trace?.generation({
      name: 'gemini-lesson-generation',
      model: modelName,
      modelParameters: { temperature: 0.7 },
      input: {
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: userPrompt,
      },
    });

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
      }
    });

    const prompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No content generated');
    }

    generation?.end({ output: content });

    const extractSpan = trace?.span({
      name: 'extract-code-and-title',
      input: content,
    });

    const code = extractCodeFromResponse(content);
    const title = extractTitleFromCode(code) || outline.substring(0, 50);

    extractSpan?.end({ output: { code, title } });

    const validateSpan = trace?.span({
      name: 'validate-code',
      input: code,
    });

    validateGeneratedCode(code);

    validateSpan?.end({ output: { valid: true } });

    return { content: code, title };
  } catch (error) {
    const errorMessage = (error as Error).message;
    generation?.end({ statusMessage: errorMessage });

    // Clean up error message for user display
    const cleanError = cleanErrorMessage(errorMessage);
    throw new Error(cleanError);
  } finally {
    await langfuse?.flushAsync();
  }
}

function cleanErrorMessage(message: string): string {
  // Extract the actual error message from Google API errors
  if (message.includes('API key not valid')) {
    return 'Invalid API key. Please check your configuration.';
  }
  if (message.includes('quota')) {
    return 'API quota exceeded. Please try again later.';
  }
  if (message.includes('400 Bad Request')) {
    return 'Invalid request. Please check your input and try again.';
  }
  if (message.includes('403')) {
    return 'Access denied. Please check your API key permissions.';
  }
  if (message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (message.includes('500') || message.includes('503')) {
    return 'Service temporarily unavailable. Please try again.';
  }

  // Return original if no pattern matches
  return message || 'Failed to generate lesson content';
}

function extractTitleFromCode(code: string): string | null {
  const titleMatch = code.match(/\/\/\s*LESSON_TITLE:\s*(.+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return null;
}

function extractCodeFromResponse(content: string): string {
  const codeBlockMatch = content.match(/```(?:typescript|tsx|javascript|jsx)?\n?([\s\S]*?)```/);

  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  return content.trim();
}

function validateGeneratedCode(code: string): void {
  if (!code.includes('function LessonComponent()')) {
    throw new Error('Generated code must contain function LessonComponent()');
  }

  const dangerousPatterns = [
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /eval\s*\(/,
    /new\s+Function\s*\(/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error('Generated code contains forbidden patterns');
    }
  }

  // Check for invalid CSS pseudo-classes in style objects
  const invalidStylePatterns = [
    /['"]:hover['"]\s*:/,
    /['"]:active['"]\s*:/,
    /['"]:focus['"]\s*:/,
    /['"]:visited['"]\s*:/,
    /['"]:nth-child['"]\s*:/,
  ];

  for (const pattern of invalidStylePatterns) {
    if (pattern.test(code)) {
      throw new Error('Invalid CSS pseudo-classes in inline styles detected. Use React state with event handlers instead.');
    }
  }
}

