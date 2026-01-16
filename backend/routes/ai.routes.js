import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/diagnosis", auth, async (req, res) => {
  try {
    const { symptoms } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a medical symptom assessment assistant.
Rules:
- DO NOT give a definitive diagnosis.
- DO NOT prescribe medication.
- Provide possible conditions only.
- Always advise consulting a qualified doctor.
- Use clear, non-alarming language.
`,
        },
        {
          role: "patient",
          content: symptoms,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ message: "AI analysis failed" });
  }
});


export default router;


