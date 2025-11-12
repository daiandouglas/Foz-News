
import React from 'react';
import { Article, ArticleStatus } from '../types';
import { KANBAN_COLUMNS } from '../constants';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  articles: Article[];
  onReviewArticle: (article: Article) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ articles, onReviewArticle }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map(column => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          articles={articles.filter(article => article.status === column.status)}
          onReviewArticle={onReviewArticle}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
