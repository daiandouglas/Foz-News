export enum UserRole {
  ADMIN = 'Administrator',
  EDITOR = 'Editor',
  COLLABORATOR = 'Collaborator',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum Tone {
  NEUTRAL = 'Neutral',
  OPTIMISTIC = 'Optimistic',
  CRITICAL = 'Critical',
  SERIOUS = 'Serious',
  ANIMATED = 'Animated',
}

export interface SourceURL {
  uri: string;
  title: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imagePrompt: string;
  status: ArticleStatus;
  sourceUrls: SourceURL[];
  topic: string;
  publishedUrl?: string;
}