import React from 'react';
import { Article, ArticleStatus } from '../types';

interface NewsCardProps {
  article: Article;
  onReview: (article: Article) => void;
}

const statusConfig = {
    [ArticleStatus.DRAFT]: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' },
    [ArticleStatus.REVIEW]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Revisão' },
    [ArticleStatus.APPROVED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovada' },
    [ArticleStatus.PUBLISHED]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Publicada' },
    [ArticleStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
};

const NewsCard: React.FC<NewsCardProps> = ({ article, onReview }) => {
  const config = statusConfig[article.status];
  const isPublished = article.status === ArticleStatus.PUBLISHED;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200 hover:shadow-md hover:border-blue-400 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        
        {isPublished && article.publishedUrl ? (
            <div className="relative group flex-1">
                <a
                    href={article.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-800 pr-2 hover:text-blue-600 hover:underline"
                >
                    {article.title}
                </a>
                <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-white border rounded-lg shadow-lg z-10 p-1 pointer-events-none">
                    <img src={article.imageUrl} alt="Pré-visualização da página" className="w-full h-auto rounded" />
                    <p className="text-xs text-center text-slate-500 p-1">Clique para abrir a notícia</p>
                </div>
            </div>
        ) : (
            <h3 className="font-bold text-slate-800 pr-2 flex-1">{article.title}</h3>
        )}
        
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.text} flex-shrink-0`}>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {article.content}
      </p>
      <button
        onClick={() => onReview(article)}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md text-sm transition-colors"
      >
        {isPublished ? 'Ver Detalhes' : 'Revisar & Gerenciar'}
      </button>
    </div>
  );
};

export default NewsCard;