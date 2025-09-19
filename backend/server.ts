import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// --- Helper function for retrying with a delay ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.post("/generate", async (req: Request, res: Response) => {
  const { goal, audience, tone, budget, timeline, usp } = req.body;
  const maxRetries = 3;
  let attempt = 0;

  const clean = (val?: string) => val?.trim() || "Not specified";
  const prompt = `
You are an expert proposal writer. Create a well-structured, professional proposal in **Markdown format**.

Details:
- Goal: ${clean(goal)}
- Target Audience: ${clean(audience)}
- Tone: ${clean(tone)}
- Budget: ${clean(budget)}
- Timeline: ${clean(timeline)}
- Unique Selling Points: ${clean(usp)}

Output Format: (use markdown headings and bullet points):
# Title
## Executive Summary
## Problem Statement
## Proposed Solution
## Unique Selling Points
## Timeline
## Budget
## Conclusion / Call to Action

Use a ${tone} writing style. Write in a clear, professional, and persuasive way. Always include all sections, even if the input is blank.
`;

  while (attempt < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      
      // If successful, send the response and exit the loop
      return res.json({ proposal: result.response.text() });

    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If this was the last attempt, send a final error response
      if (attempt >= maxRetries) {
        console.error("All retry attempts failed.");
        return res.status(500).json({ error: "Failed to generate proposal after multiple attempts. The model may be temporarily overloaded." });
      }
      
      // Wait for a short period before trying again (e.g., 1 second)
      await sleep(1000 * attempt); // Increasing delay
    }
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
