
import React from 'react';
import { Article } from '../types';
import NewsCard from './NewsCard';

interface KanbanColumnProps {
  title: string;
  articles: Article[];
  onReviewArticle: (article: Article) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, articles, onReviewArticle }) => {
  return (
    <div className="bg-slate-100 rounded-xl p-4 w-full md:w-80 lg:w-96 flex-shrink-0">
      <h2 className="text-lg font-bold text-slate-700 mb-4 px-2 flex items-center justify-between">
        {title}
        <span className="text-sm font-semibold bg-slate-200 text-slate-600 rounded-full px-3 py-1">{articles.length}</span>
      </h2>
      <div className="space-y-4 h-[calc(100vh-20rem)] overflow-y-auto pr-2">
        {articles.length > 0 ? (
          articles.map(article => (
            <NewsCard key={article.id} article={article} onReview={onReviewArticle} />
          ))
        ) : (
          <div className="text-center text-slate-500 pt-10">
            <p>Nenhum artigo aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
