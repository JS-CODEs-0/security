import OpenAI from "openai";
import { buildBookSystemPrompt } from "./bookPrompts";

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";

function getApiKey(): string {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) {
    throw new Error(
      "NVIDIA_API_KEY is not defined in environment variables. Please check .env.local."
    );
  }
  return key;
}

/**
 * Singleton OpenAI client configured for NVIDIA's chat completions endpoint.
 * Kept exclusively on the server side.
 */
let nvidiaClientInstance: OpenAI | null = null;

export function getNvidiaClient(): OpenAI {
  if (!nvidiaClientInstance) {
    nvidiaClientInstance = new OpenAI({
      baseURL: NVIDIA_BASE_URL,
      apiKey: getApiKey(),
    });
  }
  return nvidiaClientInstance;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChatOptions {
  bookId: string;
  pageNumber?: number;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  temperature?: number;
  maxTokens?: number;
}

/**
 * Shared reusable AI completion service for all seven cybersecurity books.
 * Powered by NVIDIA Nemotron 3 Ultra (550B).
 */
export async function createNvidiaStream({
  bookId,
  pageNumber = 1,
  messages,
  temperature = 0.7,
  maxTokens = 2048,
}: StreamChatOptions) {
  const client = getNvidiaClient();

  // 1. Generate specialised system prompt with active book & page context
  const systemPrompt = buildBookSystemPrompt(bookId, pageNumber);

  // 2. Assemble conversation history with specialised system instruction as the root
  const fullMessages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...messages,
  ];

  // 3. Invoke NVIDIA Nemotron 3 Ultra
  const stream = await client.chat.completions.create({
    model: NVIDIA_MODEL,
    messages: fullMessages,
    temperature,
    max_tokens: maxTokens,
    top_p: 0.95,
    stream: true,
  });

  return stream;
}
