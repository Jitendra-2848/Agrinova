import { GoogleGenerativeAI } from "@google/generative-ai";

export async function api({
  apiKey,
  systemPrompt,
  content,
  model = "gemini-2.0-flash"
}) {
  if (!apiKey) throw new Error("Missing apiKey");
  if (!systemPrompt) throw new Error("Missing systemPrompt");
  if (!content) throw new Error("Missing content");

  try {
    const client = new GoogleGenerativeAI(apiKey);

    // ✅ Convert content into plain text prompt
    let userMessage = "";

    if (typeof content === "object" && content.from && content.to) {
      userMessage = `pincode from ${content.from} to ${content.to}`;
    } else {
      userMessage = JSON.stringify(content);
    }

    // ✅ Get model reference
    const modelRef = client.getGenerativeModel({ model });

    // ✅ Generate response
    const result = await modelRef.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      systemInstruction: systemPrompt
    });

    // ✅ Return output text safely
    return result.response.text() || "No response from AI.";
  
  } catch (error) {
    console.error("❌ AI Error:", error);
    return "Error generating AI content.";
  }
}
