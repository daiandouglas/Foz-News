import { Tone, SourceURL } from '../types';

interface ProspectResult {
  topics: { topic: string }[];
  sources: SourceURL[];
}

export const prospectNews = async (keywords: string[], timeRange: string): Promise<ProspectResult> => {
  const response = await fetch('/api/prospect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, timeRange }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Falha na prospecção');
  }
  return response.json();
};

export const generateArticle = async (topic: string, tone: Tone, length: number): Promise<{ title: string; content: string }> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, tone, length }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Falha na geração do artigo');
  }
  return response.json();
};

export const generateImage = async (articleTitle: string, customPrompt?: string): Promise<{ base64Image: string, prompt: string }> => {
  const response = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleTitle, customPrompt }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Falha na geração da imagem');
  }
  return response.json();
};