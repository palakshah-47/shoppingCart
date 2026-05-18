import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    'Warning: OPENAI_API_KEY is not set. AI features will not work.',
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AICompletionOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

export type ToolDefinition = {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export type ToolUseBlock = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

const DEFAULT_MODEL = 'gpt-4o-mini';

function buildMessages(
  messages: ChatMessage[],
  systemPrompt?: string,
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (systemPrompt) {
    apiMessages.push({ role: 'system', content: systemPrompt });
  }
  for (const msg of messages) {
    apiMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }
  return apiMessages;
}

function convertToolsToOpenAI(tools: ToolDefinition[]): OpenAI.Chat.ChatCompletionTool[] {
  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

export async function getAICompletion(
  messages: ChatMessage[],
  options: AICompletionOptions = {},
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt,
  } = options;

  const apiMessages = buildMessages(messages, systemPrompt);

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: apiMessages,
      max_tokens: maxTokens,
      temperature,
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        error: error.error,
      });
      
      // Check for insufficient funds / billing errors
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Authentication failed. Check your OpenAI API key.');
      }
      if (error.status === 402 || error.message?.includes('insufficient_quota')) {
        throw new Error('Insufficient funds. Please check your OpenAI account balance.');
      }
      
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    
    throw error;
  }
}

export async function getAICompletionWithTools(
  messages: ChatMessage[],
  tools: ToolDefinition[],
  options: AICompletionOptions = {},
): Promise<{
  content: string | null;
  toolUse: ToolUseBlock | null;
  stopReason: string;
}> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt,
  } = options;

  const apiMessages = buildMessages(messages, systemPrompt);
  const openaiTools = convertToolsToOpenAI(tools);

  const response = await openai.chat.completions.create({
    model,
    messages: apiMessages,
    tools: openaiTools,
    max_tokens: maxTokens,
    temperature,
  });

  const choice = response.choices[0];
  const message = choice?.message;
  const toolCalls = message?.tool_calls;

  let content: string | null = message?.content?.trim() ?? null;
  let toolUse: ToolUseBlock | null = null;
  let stopReason = choice?.finish_reason ?? 'stop';

  if (toolCalls && toolCalls.length > 0) {
    const toolCall = toolCalls[0];
    stopReason = 'tool_calls';
    toolUse = {
      type: 'tool_use',
      id: toolCall.id,
      name: toolCall.function.name,
      input: (() => {
        try {
          return JSON.parse(
            toolCall.function.arguments || '{}',
          ) as Record<string, unknown>;
        } catch {
          return {};
        }
      })(),
    };
  }

  return {
    content,
    toolUse,
    stopReason,
  };
}

export async function streamAICompletion(
  messages: ChatMessage[],
  options: AICompletionOptions = {},
  onChunk: (chunk: string) => void,
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 1000,
    systemPrompt,
  } = options;

  const apiMessages = buildMessages(messages, systemPrompt);

  const stream = await openai.chat.completions.create({
    model,
    messages: apiMessages,
    max_tokens: maxTokens,
    stream: true,
  });

  let fullText = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? '';
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }
  return fullText;
}

export default openai;
