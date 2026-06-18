import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crashing if the key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER")) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Stylist Curation Endpoint
app.post("/api/stylist", async (req, res) => {
  try {
    const { message, activeCart, currentItem } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Fallback response with beautiful minimalist fashion wisdom if API key is not present/configured
      const fallbackOptions = [
        "Given our focus on architectural lines, I highly recommend styling the Double-Breasted Wool Coat with our Alabaster Heavyweight Knit. The contrast in draping and weight creates a perfect high-end editorial silhouette.",
        "Monochrome garments are most powerful when layered by texture. Try pairing the Organic Linen Trousers with the Cashmere Knit lounge pants under our structured Charcoal Blazer to master tonal alignment.",
        "The Chelsea Leather Boots are structured with a sharp modern shape. For an effortless COS-inspired outfit, combine them with relaxed-fit tailoring in Obsidian black.",
        "Merino wool offers superb form-retention and breathability. For size recommendations, our Tailored Blazer runs true to European scale, while the Heavyweight Knit features a intended oversized drape. Choose your typical size for an architectural fit."
      ];
      const randomAdvice = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
      return res.json({
        response: `[Aura Concierge Assistant - Demo Mode]\n\n${randomAdvice}\n\n*To unlock real-time personalized styling, please enter your Gemini API Key in the Secrets panel.*`
      });
    }

    const cartContext = activeCart && activeCart.length > 0 
      ? `The user currently has these items in their shopping cart: ${activeCart.map((i: any) => `${i.name} (Qty: ${i.qty})`).join(", ")}.`
      : "The user's shopping cart is currently empty.";

    const productContext = currentItem 
      ? `The user is currently admiring the "${currentItem.name}" (${currentItem.category}), priced at $${currentItem.price}. Fabric: ${currentItem.fabric}, Fit: ${currentItem.fit}, Colors available: ${currentItem.colors.join(", ")}.`
      : "The user is browsing our editorial autumn/winter collection.";

    const prompt = `You are the chief personal stylist and lifestyle concierge for ATELIER, a world-class luxury minimalist clothing line comparable styling-wise to Zara, COS, and Massimo Dutti. 
    Our aesthetic is quiet luxury, architectural silhouettes, heavy texturing, drop-shoulder shapes, and a monochrome palette (Slate, Obsidian, Alabaster, Sand, Charcoal).

    Contextual Information:
    - ${cartContext}
    - ${productContext}

    Current User Message:
    "${message}"

    Please respond with warm, styling-expert advice. Use clean styling terminology (such as 'negative space', 'drape', 'architectural tailoring', 'textural contrast', 'monochromatic styling'). Keep your response under 150 words. Do not use generic fashion sales hype. State recommended clothing combinations from our catalog (Atelier offers: Double-Breasted Wool Coat, Cashmere Trench, Alabaster Heavyweight Knit, Structured Tailored Blazer, Organic Linen Trousers, Silk Sateen Slip Dress, Chelsea Boots). Keep your tone elegant, premium, and sophisticated.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const reply = response.text || "Our tailoring workshops suggest pairing structures with soft drapes for the quintessential Atelier silhouette.";
    return res.json({ response: reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to fetch recommendation", details: err.message });
  }
});

// Start server and handle Vite middleware in local dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Statics
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Atelier Server] Launched secure instance on http://localhost:${PORT}`);
  });
}

startServer();
