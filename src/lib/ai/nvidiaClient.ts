import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { buildBookSystemPrompt } from "./bookPrompts";

/**
 * Fallback parser to ensure .env.local and .env are always read in Node.js
 * if process.env has not yet been populated by the server runner.
 */
function ensureEnvLoaded() {
  if (process.env.NVIDIA_API_KEY) return;

  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    try {
      const filePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), filename);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch {
      // Ignore file reading errors
    }
    if (process.env.NVIDIA_API_KEY) break;
  }
}

export function getNvidiaConfig(): {
  apiKey: string;
  baseURL: string;
  model: string;
} {
  ensureEnvLoaded();

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_nvidia_api_key_here") {
    throw new Error(
      "NVIDIA_API_KEY is not defined in environment variables. Please check .env.local."
    );
  }

  const baseURL =
    process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model =
    process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";

  return { apiKey: apiKey.trim(), baseURL: baseURL.trim(), model: model.trim() };
}

/**
 * Returns a configured OpenAI client instance for NVIDIA's chat completions endpoint.
 * Runs exclusively on the server side.
 */
export function getNvidiaClient(): { client: OpenAI; model: string } {
  const { apiKey, baseURL, model } = getNvidiaConfig();
  const client = new OpenAI({
    baseURL,
    apiKey,
  });
  return { client, model };
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
  const { client, model } = getNvidiaClient();

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
    model,
    messages: fullMessages,
    temperature,
    max_tokens: maxTokens,
    top_p: 0.95,
    stream: true,
  });

  return stream;
}
