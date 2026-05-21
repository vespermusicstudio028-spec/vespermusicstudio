import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));


// Initialize Gemini SDK with named parameter and 'aistudio-build' User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST API for lyrics & vibe brainstorming using Gemini
app.post("/api/brainstorm", async (req, res) => {
  try {
    const { objective, mood, briefDetails, companyName } = req.body;

    if (!objective || !mood) {
      return res.status(400).json({ error: "Objective and mood are required." });
    }

    if (!ai) {
      // Graceful fallback if API key is not present in development
      return res.json({
        lyrics: `[Verso 1]\nNo silêncio da noite, uma ideia germinou\nVesper Music no tom que você sonhou.\n\n[Refrão]\nCom a nossa produção, o som vai decolar\nSeu briefing musical tá pronto pra brilhar!\n\n(Dica: configure sua chave de API GEMINI_API_KEY nas Configurações do AI Studio para obter retornos reais de IA!)`,
        slogans: [
          `Sua história, nossa melodia.`,
          `Onde a inspiração encontra a produção.`,
          `Sua marca no ritmo certo.`
        ],
        structure: ["Introdução Suave", "Verso Acústico", "Refrão Enérgico com Sintetizador", "Finalização em Fade-out"],
        tips: [
          "Dê preferência a uma voz calorosa de barítono ou vocal feminino suave.",
          "O andamento ideal seria em torno de 120 BPM para transmitir energia.",
          "Fale agora mesmo com o produtor via WhatsApp para tirar esse projeto do papel!"
        ]
      });
    }

    const prompt = `Como produtor musical experiente do Vesper Music Studio, analise esta solicitação de briefing de música e crie uma proposta criativa.
Detalhes do Briefing:
- Objetivo do Projeto: ${objective}
${companyName ? `- Nome da Empresa/Homenageado: ${companyName}` : ""}
- Estilo/Vibe desejado: ${mood}
- Detalhes adicionais/História do cliente: ${briefDetails || "Nenhum detalhe adicional fornecido."}

Por favor, gere uma resposta detalhada formatada em JSON contendo:
1. "lyrics": Uma sugestão de 2 estrofes de letra ou jingle inspirador em português adequada para este estilo.
2. "slogans": Um array de 3 slogans melódicos ou frases de efeito em português.
3. "structure": Um array contendo as seções sugeridas da estrutura musical recomendada (por exemplo: ["Introdução", "Verso", "Refrão", "Outro"]).
4. "tips": Um array com 3 dicas de produção de estúdio personalizadas elaboradas sob medida para este briefing (por exemplo, instrumentos, andamento (BPM) ou tom sugerido).

A resposta DEVE ser estritamente no formato JSON válido. Não coloque nenhuma formatação markdown (como \`\`\`json) na resposta, envie apenas a string JSON pura.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const cleanJson = text.trim();
    const result = JSON.parse(cleanJson);
    res.json(result);

  } catch (error: any) {
    console.error("Gemini Brainstorming Error:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao processar o seu briefing com a IA da Vesper.",
      details: error.message
    });
  }
});

// REST API to fetch edited tracks list from src/data/tracks.json
app.get("/api/tracks", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "src", "data", "tracks.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json([]);
  } catch (error: any) {
    console.error("Error reading tracks:", error);
    res.status(500).json({
      error: "Erro ao ler as faixas no servidor.",
      details: error.message
    });
  }
});

// REST API to save edited tracks list to src/data/tracks.json
app.post("/api/save-tracks", async (req, res) => {
  try {
    const { tracks } = req.body;
    if (!tracks || !Array.isArray(tracks)) {
      return res.status(400).json({ error: "Tracks array is required." });
    }

    const filePath = path.join(__dirname, "src", "data", "tracks.json");
    
    // Ensure the data directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(tracks, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error saving tracks:", error);
    res.status(500).json({
      error: "Erro ao salvar as faixas no arquivo tracks.json.",
      details: error.message
    });
  }
});

// REST API to upload custom audio files to public/audio/
app.post("/api/upload-audio", async (req, res) => {
  try {
    const { trackId, filename, base64Data } = req.body;
    if (!trackId || !filename || !base64Data) {
      return res.status(400).json({ error: "Missing trackId, filename, or base64Data." });
    }

    // Clean up filename and get extension
    const cleanFilename = `${trackId}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    
    // Ensure public/audio directory exists
    const audioDir = path.join(__dirname, "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filePath = path.join(audioDir, cleanFilename);
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      audioUrl: `/audio/${cleanFilename}`
    });
  } catch (error: any) {
    console.error("Error uploading audio:", error);
    res.status(500).json({
      error: "Erro ao fazer upload do áudio para o servidor.",
      details: error.message
    });
  }
});

// Setup Vite dev middleware or standard client asset serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
