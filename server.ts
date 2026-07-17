import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini Initialization
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    // @ts-ignore
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
}

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { content, type } = req.body;
    const ai = getGenAI();
    // @ts-ignore
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      As an expert Aerospace Engineer for Hanwha Aerospace, analyze the following ${type} content for a power system design.
      
      Identify:
      1. Key technical requirements (Voltage, Current, Noise, etc.)
      2. Potential conflicts with MIL-STD or RFP standards.
      3. Missing information that needs user confirmation.
      
      Content:
      ${content}
      
      Return the analysis in JSON format with fields: requirements (array), conflicts (array), and questions (array).
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Attempt to parse JSON from Markdown if necessary
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { requirements: [], conflicts: [], questions: [] };

    res.json(analysis);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-document", async (req, res) => {
  try {
    const { analysis, confirmedData } = req.body;
    const ai = getGenAI();
    // @ts-ignore
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate a professional technical specification document draft based on the following analysis and user-confirmed data.
      Use Hanwha Aerospace standard terminology. 
      Include sections for: Introduction, Requirements, Verification Matrix, and Conclusion.
      Include grounding citations like [RFP Section 3.2].
      
      Analysis: ${JSON.stringify(analysis)}
      Confirmed Data: ${JSON.stringify(confirmedData)}
    `;

    const result = await model.generateContent(prompt);
    res.json({ document: result.response.text() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite Integration
async function setupVite() {
  console.log("Setting up Vite middleware...");
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      // Explicitly serve index.html for the root route in dev mode if needed
      app.get("*", async (req, res, next) => {
        if (req.url.startsWith("/api")) return next();
        try {
          const fs = await import("fs");
          const template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
          const html = await vite.transformIndexHtml(req.url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
      
      console.log("Vite middleware mounted.");
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      console.log("Production static assets mounted.");
    }
  } catch (err) {
    console.error("Vite Setup Failed:", err);
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error("Server Start Failed:", err);
});
