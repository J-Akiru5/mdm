import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { services } from "@/data/services";
import { portfolioItems } from "@/data/portfolio";
import { testimonials } from "@/data/testimonials";
import { stats } from "@/data/stats";

function buildSystemPrompt(): string {
  const serviceList = services.map((s) => `- ${s.title}: ${s.description}`).join("\n");

  const portfolioList = portfolioItems
    .filter((p) => p.clientName)
    .map((p) => `- ${p.title} (${p.category}) for ${p.clientName}`)
    .join("\n");

  const testimonialList = testimonials
    .map((t) => `- "${t.quote.slice(0, 120)}..." — ${t.name}, ${t.title} at ${t.company}`)
    .join("\n");

  const statsList = stats.map((s) => `- ${s.value}${s.suffix} ${s.label}`).join("\n");

  return `You are the MDM Events Management assistant. You represent MDM Events Management, a technology-driven event solutions company based in Iloilo, Philippines.

Company overview:
MDM Events Management (mdmevents.org) is a full-service event planning, production, and technology deployment company serving corporate, government, and brand clients across the Philippines. They handle everything from concept development and venue management to catering, entertainment, logistics, marketing, and technology solutions.

Key stats:
${statsList}

Services offered:
${serviceList}

Notable portfolio projects:
${portfolioList}

Client testimonials:
${testimonialList}

Guidelines:
- Be friendly, professional, and concise.
- Answer questions about MDM's services, portfolio, and capabilities using the information above.
- If asked something outside your knowledge, politely say you're not sure and offer to connect the person with MDM directly (direct them to the contact page or quote form).
- If the user expresses interest in booking or getting a quote, encourage them to visit the contact page or use the quote form.
- If the user seems to want to leave feedback or a review, let them know they can switch to "Feedback" mode using the toggle button in the header.
- Keep responses relatively brief and conversational — this is a chat widget, not a document.
- Do not make up information about MDM that is not provided above.`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file." },
        { status: 500 },
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const historyMsgs = messages.slice(0, -1);
    const firstUserIdx = historyMsgs.findIndex((m: { role: string }) => m.role === "user");
    const validHistory = firstUserIdx >= 0 ? historyMsgs.slice(firstUserIdx) : [];

    const chat = model.startChat({
      history: validHistory.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Failed to get response from AI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
