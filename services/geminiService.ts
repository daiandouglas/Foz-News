import { GoogleGenAI } from "@google/genai";
import { Tone, SourceURL } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ProspectResult {
  topics: { topic: string }[];
  sources: SourceURL[];
}

export const prospectNews = async (city: string, keywords: string[], timeRange: string): Promise<ProspectResult> => {
  const prompt = `
    Atue como um agregador de notícias. Pesquise as notícias mais relevantes sobre "${city}" e palavras-chave relacionadas como "${keywords.join(', ')}" ${timeRange}.
    Identifique as 3 notícias mais significativas. Para cada notícia, forneça um resumo conciso de uma frase para usar como tópico.
    Responda APENAS com uma string JSON contendo um array de objetos, onde cada objeto tem uma chave "topic".
    Exemplo de formato de resposta: [{"topic": "Resumo da notícia 1"}, {"topic": "Resumo da notícia 2"}]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text.trim();
    // Basic cleanup if the response is wrapped in markdown
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
    const topics = JSON.parse(cleanedText);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Fonte desconhecida'
      }))
      .filter(source => source.uri);

    return { topics, sources };
  } catch (error) {
    console.error("Error prospecting news:", error);
    throw new Error("Falha ao buscar notícias. A resposta da IA pode não ser um JSON válido.");
  }
};

export const generateArticle = async (topic: string, tone: Tone, length: number): Promise<{ title: string; content: string }> => {
  const systemInstruction = `Você é um jornalista profissional escrevendo para um portal de notícias local chamado 'Sul News' em Foz do Iguaçu, Brasil. Seu público é a comunidade local. Mantenha a linguagem clara, objetiva e relevante para os leitores da região.`;
  const prompt = `
    Com base no seguinte tópico: "${topic}", escreva uma notícia.
    - Tom: ${tone}
    - Tamanho: Aproximadamente ${length} palavras.
    - A notícia deve ter um título chamativo e um corpo de texto informativo.
    - Responda com um objeto JSON contendo as chaves "title" e "content". Não inclua nenhuma formatação markdown no JSON.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: 2, // OBJECT
        properties: {
          title: { type: 1 }, // STRING
          content: { type: 1 } // STRING
        }
      }
    },
  });

  const parsed = JSON.parse(response.text);
  return parsed;
};

export const generateImage = async (articleTitle: string): Promise<{ base64Image: string, prompt: string }> => {
  const imagePrompt = `Foto jornalística minimalista e elegante para uma notícia com o título: "${articleTitle}". A imagem deve ser relevante para o contexto de Foz do Iguaçu. Estilo fotorrealista.`;
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: imagePrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });

  const base64Image = response.generatedImages[0].image.imageBytes;
  return { base64Image, prompt: imagePrompt };
};