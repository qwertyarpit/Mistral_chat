// app/api/chat/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge"; // optional; can be "nodejs" if you prefer

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL ?? "mistral-small-latest",
        messages,
        // For MVP we avoid streaming; simpler client
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: errorText }), { status: 500 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return Response.json({ content });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), { status: 500 });
  }
}

