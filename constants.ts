
import { ArticleStatus } from './types';

export const KANBAN_COLUMNS: { title: string; status: ArticleStatus }[] = [
  { title: 'Novos Rascunhos', status: ArticleStatus.DRAFT },
  { title: 'Em Revisão', status: ArticleStatus.REVIEW },
  { title: 'Aprovadas', status: ArticleStatus.APPROVED },
  { title: 'Publicadas', status: ArticleStatus.PUBLISHED },
  { title: 'Canceladas', status: ArticleStatus.CANCELLED },
];
