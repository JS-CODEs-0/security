import { NextRequest, NextResponse } from "next/server";
import { createNvidiaStream, getNvidiaConfig } from "@/lib/ai/nvidiaClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Check for API key availability upfront with clear server-side message
    try {
      getNvidiaConfig();
    } catch (configErr: any) {
      return NextResponse.json(
        {
          error:
            configErr?.message ||
            "NVIDIA_API_KEY is not defined in environment variables. Please check .env.local.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { bookId, pageNumber = 1, messages } = body;

    if (!bookId || typeof bookId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'bookId' parameter." },
        { status: 400 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array must contain at least one message." },
        { status: 400 }
      );
    }

    // Format and sanitize messages
    const sanitizedMessages: { role: "user" | "assistant"; content: string }[] = messages.map(
      (m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").trim(),
      })
    );

    // Invoke the shared NVIDIA Nemotron 3 Ultra service
    const stream = await createNvidiaStream({
      bookId,
      pageNumber: Number(pageNumber) || 1,
      messages: sanitizedMessages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // Create a TextEncoder stream for streaming response back to client
    const encoder = new TextEncoder();
    let isStreamClosed = false;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (isStreamClosed || controller.desiredSize === null) {
              break;
            }
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          if (!isStreamClosed && controller.desiredSize !== null) {
            isStreamClosed = true;
            controller.close();
          }
        } catch (streamError: any) {
          if (streamError?.code === "ERR_INVALID_STATE" || isStreamClosed) {
            return;
          }
          console.error("Stream processing error:", streamError);
          try {
            if (!isStreamClosed && controller.desiredSize !== null) {
              isStreamClosed = true;
              controller.error(streamError);
            }
          } catch {
            // Already closed
          }
        }
      },
      cancel() {
        isStreamClosed = true;
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    const errorMessage =
      error?.message || "Internal server error connecting to NVIDIA AI service.";
    return NextResponse.json(
      { error: errorMessage },
      { status: error?.status || 500 }
    );
  }
}
