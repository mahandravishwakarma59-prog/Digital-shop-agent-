const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- Shop knowledge base (edit this for any new client) ----
const SHOP_KNOWLEDGE = [
  "Aadhar card banwane ke liye phone number chahiye hota hai",
  "PAN card banwane ke liye bank account number chahiye hota hai",
  "Phone pe se paise bhejne/nikalne ki bhi service hai, jisme se ₹10 kaat liya jaata hai",
  "Aadhar card banwane ki fees ₹200 hai",
  "Shop subah 10:00 baje se raat 8:00 baje tak khuli rehti hai, Sunday ko bhi chalu rehta hai",
  "Shop ki location Buxwaha hai",
];

const SYSTEM_PROMPT = `Tum ek business ke liye customer-facing AI assistant ho. Sirf neeche di gayi jaankari ke aadhar par jawab do, seedha aur helpful tareeke se, Hinglish mein baat karo.

Business ki jaankari:
${SHOP_KNOWLEDGE.map((l) => "- " + l).join("\n")}

Agar poocha gaya sawaal is jaankari mein cover nahi hota, toh honestly bata do ki ye jaankari abhi available nahi hai, guess mat karo.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not set on server" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(502).json({ error: "AI service error" });
    }

    const textBlock = (data.content || []).find((c) => c.type === "text");
    const reply = textBlock ? textBlock.text : "Maaf karo, jawab nahi mil paya.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Shop agent running on port ${PORT}`));
