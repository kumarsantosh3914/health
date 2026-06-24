import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { Doctor } from "@/lib/types";
import { getFeeTier } from "@/lib/constants";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a helpful healthcare assistant for India Health Arena.
You help users find doctors, clinics, and hospitals across Indian cities.
You have access to the current city and doctor listings provided as context.
Answer in clear, friendly language. Support both English and Hinglish.
Never give medical diagnoses. Always recommend consulting a real doctor.
When recommending doctors, reference real listings from the context provided.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildContext(city: string, doctors: Doctor[]): string {
  // Cap the listing to keep the prompt within a reasonable token budget.
  const top = doctors.slice(0, 30);
  const lines = top.map((d) => {
    const tier = getFeeTier(d.consultation_fee).label;
    return `- ${d.name} (${d.speciality}) at ${d.clinic.name}, ${
      d.clinic.neighbourhood || d.clinic.address
    } · ⭐${d.rating} · ${d.patient_count} patients · fee ${tier} ₹${
      d.consultation_fee
    } · ${d.available_online ? "online available" : "in-person"} · ${
      d.is_open_now ? "open now" : "closed now"
    }`;
  });
  return `Current city: ${city}\nDoctors currently shown (${doctors.length} total, first ${top.length} listed):\n${lines.join(
    "\n"
  )}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI is not configured. Add OPENAI_API_KEY to .env.local to enable Ask AI.",
        },
        { status: 503 }
      );
    }

    const { messages, city, doctors } = (await req.json()) as {
      messages: ChatMessage[];
      city: string;
      doctors: Doctor[];
    };

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 600,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "system",
          content: `CONTEXT:\n${buildContext(city, doctors ?? [])}`,
        },
        ...(messages ?? []).map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("POST /api/ask error:", err);
    return NextResponse.json(
      { error: "AI request failed. Please try again." },
      { status: 500 }
    );
  }
}
