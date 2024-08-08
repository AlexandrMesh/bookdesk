import { ALL, COMPLETED, IN_PROGRESS, PLANNED } from '~constants/boardType';

export interface IRating {
  bookId: string;
  rating: number;
}

export type BookStatus = typeof ALL | typeof PLANNED | typeof IN_PROGRESS | typeof COMPLETED;

export interface ICategory {
  path: string;
  value: string;
  language: string;
}

export interface IBook {
  bookId: string;
  title?: string;
  coverPath?: string;
  authorsList?: string[];
  pages?: number;
  categoryValue?: string;
  bookStatus: BookStatus | null;
  added?: number;
  votesCount?: number;
  annotation?: string;
  comment?: string;
  commentAdded?: number | null;
  categoryPath?: string;
}

export interface IVote {
  bookId: string;
  count: number;
}

export interface IComment {
  bookId: string;
  comment: string;
  added: number;
}
