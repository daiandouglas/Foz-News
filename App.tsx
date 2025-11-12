import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import ReviewModal from './components/ReviewModal';
import StatCard from './components/StatCard';
import Spinner from './components/Spinner';
import { Article, ArticleStatus, Tone } from './types';
import * as geminiService from './services/geminiService';

const initialArticles: Article[] = []; // Start with no articles

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  
  // -- Config State --
  const [prospectConfig, setProspectConfig] = useState({ city: "Foz do Iguaçu", keywords: "Cataratas, Itaipu, fronteira" });
  const [generationConfig, setGenerationConfig] = useState({ tone: Tone.NEUTRAL, length: 150, count: 3 });

  const stats = useMemo(() => {
    return articles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1;
      return acc;
    }, {} as Record<ArticleStatus, number>);
  }, [articles]);

  const handleProspectNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { topics, sources } = await geminiService.prospectNews(prospectConfig.city, prospectConfig.keywords.split(',').map(k => k.trim()));
      
      const newArticles: Article[] = [];
      for (const item of topics.slice(0, generationConfig.count)) {
        const { title, content } = await geminiService.generateArticle(item.topic, generationConfig.tone, generationConfig.length);
        const { base64Image, prompt } = await geminiService.generateImage(title);

        newArticles.push({
          id: `art_${Date.now()}_${Math.random()}`,
          title,
          content,
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
          imagePrompt: prompt,
          status: ArticleStatus.DRAFT,
          sourceUrls: sources,
          topic: item.topic,
        });
      }
      setArticles(prev => [...prev, ...newArticles]);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewArticle = (article: Article) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentArticle(null);
  };

  const handleSaveArticle = (updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    setCurrentArticle(updatedArticle);
  };

  const handleUpdateStatus = (articleId: string, status: ArticleStatus) => {
    setArticles(prev => prev.map(a => {
        if (a.id === articleId) {
            const updatedArticle = { ...a, status };
            if (status === ArticleStatus.PUBLISHED) {
                // Simulate getting a published URL
                updatedArticle.publishedUrl = `https://github.com/daiandouglas/Sul-News`;
            }
            return updatedArticle;
        }
        return a;
    }));
    handleCloseModal();
  };

  const handleRegenerateImage = useCallback(async (article: Article) => {
    if (!article) return;
    setIsUpdating(true);
    try {
        const { base64Image, prompt } = await geminiService.generateImage(article.title);
        const updatedArticle = { 
            ...article, 
            imageUrl: `data:image/jpeg;base64,${base64Image}`,
            imagePrompt: prompt 
        };
        handleSaveArticle(updatedArticle);
    } catch (err) {
        // Handle error, maybe show a toast
        console.error("Failed to regenerate image", err);
    } finally {
        setIsUpdating(false);
    }
  }, []);

  const iconProps = "h-6 w-6 text-white";
  const statIcons = {
    draft: <svg xmlns="http://www.w3.org/2000/svg" className={iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    review: <svg xmlns="http://www.w3.org/2000/svg" className={iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    approved: <svg xmlns="http://www.w3.org/2000/svg" className={iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    published: <svg xmlns="http://www.w3.org/2000/svg" className={iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0C19.155 17.182 15.845 20 12 20c-3.844 0-7.154-2.818-8.716-6.747M12 10.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>,
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Painel de Controle */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Painel de Geração de Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
             <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Tom</label>
                <select value={generationConfig.tone} onChange={e => setGenerationConfig(c => ({...c, tone: e.target.value as Tone}))} className="w-full p-2 border border-slate-300 rounded-md bg-white">
                    {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
             <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Tamanho (palavras)</label>
                <input type="number" value={generationConfig.length} onChange={e => setGenerationConfig(c => ({...c, length: parseInt(e.target.value)}))} className="w-full p-2 border border-slate-300 rounded-md bg-white"/>
             </div>
             <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Qtd. de Artigos</label>
                <input type="number" min="1" max="5" value={generationConfig.count} onChange={e => setGenerationConfig(c => ({...c, count: parseInt(e.target.value)}))} className="w-full p-2 border border-slate-300 rounded-md bg-white"/>
             </div>
             <button onClick={handleProspectNews} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center">
                {isLoading ? <Spinner size="sm"/> : 'Prospectar & Gerar Notícias'}
             </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Rascunhos" value={stats.DRAFT || 0} icon={statIcons.draft} color="bg-gray-400"/>
            <StatCard title="Em Revisão" value={stats.REVIEW || 0} icon={statIcons.review} color="bg-yellow-400"/>
            <StatCard title="Aprovadas" value={stats.APPROVED || 0} icon={statIcons.approved} color="bg-green-400"/>
            <StatCard title="Publicadas" value={stats.PUBLISHED || 0} icon={statIcons.published} color="bg-blue-400"/>
        </div>

        {/* Kanban Board */}
        <KanbanBoard articles={articles} onReviewArticle={handleReviewArticle} />
      </main>

      <ReviewModal
        isOpen={isModalOpen}
        article={currentArticle}
        onClose={handleCloseModal}
        onSave={handleSaveArticle}
        onUpdateStatus={handleUpdateStatus}
        onRegenerateImage={handleRegenerateImage}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default App;