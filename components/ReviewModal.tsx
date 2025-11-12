
import React, { useState, useEffect } from 'react';
import { Article, ArticleStatus, SourceURL } from '../types';
import Spinner from './Spinner';

interface ReviewModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedArticle: Article) => void;
  onUpdateStatus: (articleId: string, status: ArticleStatus) => void;
  onRegenerateImage: (article: Article) => Promise<void>;
  isUpdating: boolean;
}

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


const ReviewModal: React.FC<ReviewModalProps> = ({ article, isOpen, onClose, onSave, onUpdateStatus, onRegenerateImage, isUpdating }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSave = () => {
    onSave({ ...article, title: editedTitle, content: editedContent });
  };

  const handleStatusChange = (status: ArticleStatus) => {
    handleSave();
    onUpdateStatus(article.id, status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Revisão Editorial</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>

        <div className="flex-grow p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna de Texto */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Título</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Conteúdo</label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md h-64 resize-none"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Fontes Utilizadas</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {article.sourceUrls.map((source, index) => (
                    <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-start">
                        <LinkIcon />
                        <span className="flex-1">{source.title || source.uri}</span>
                    </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna de Imagem */}
          <div className="flex flex-col gap-4">
             <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                 {isUpdating ? <Spinner /> : <img src={article.imageUrl} alt="Article visual" className="w-full h-full object-cover" />}
             </div>
             <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Prompt da Imagem</label>
                <p className="text-xs p-2 bg-slate-50 text-slate-500 rounded-md border">{article.imagePrompt}</p>
             </div>
             <button
                onClick={() => onRegenerateImage(article)}
                disabled={isUpdating}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
             >
                {isUpdating ? 'Gerando...' : 'Gerar Nova Imagem'}
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap gap-2">
                 <button onClick={() => onUpdateStatus(article.id, ArticleStatus.REVIEW)} className="px-4 py-2 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200">Mover para Revisão</button>
                 <button onClick={() => handleStatusChange(ArticleStatus.APPROVED)} className="px-4 py-2 text-sm font-semibold text-green-800 bg-green-100 rounded-md hover:bg-green-200">Aprovar</button>
                 <button onClick={() => onUpdateStatus(article.id, ArticleStatus.PUBLISHED)} className="px-4 py-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-md hover:bg-blue-200">Publicar</button>
                 <button onClick={() => onUpdateStatus(article.id, ArticleStatus.CANCELLED)} className="px-4 py-2 text-sm font-semibold text-red-800 bg-red-100 rounded-md hover:bg-red-200">Cancelar</button>
            </div>
            <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">Fechar</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Salvar Alterações</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
