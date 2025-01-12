import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyBu6pFi74BiegWh23w-odTHks5rPIpMG24");

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const userName = session?.user?.name || "Guest";
    const { messages } = await req.json();

    if (messages[messages.length - 1].content.toLowerCase().includes("hello")) {
      return NextResponse.json({
        response: {
          role: "assistant",
          content: `Hello ${userName}! Which type of movie you want to watch? I will find for you.`,
        },
      });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const userInput =
      messages[messages.length - 1].content + "limit response is 100 words";
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: messages
            .slice(0, -1)
            // .filter((msg: any) => msg.role === "user")
            .map((msg: { content: string }) => ({ text: msg.content })),
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });
    const result = await chat.sendMessage(userInput);
    const response = await result.response;

    return NextResponse.json({
      response: {
        role: "assistant",
        content: response?.text() || response.toString(),
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 }
    );
  }
}
