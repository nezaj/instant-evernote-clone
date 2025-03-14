// types/index.ts
import { InstaQLEntity } from '@instantdb/react';
import { AppSchema } from '../instant.schema';

// Entity types
export type NoteEntity = InstaQLEntity<AppSchema, 'notes'>;
export type NotebookEntity = InstaQLEntity<AppSchema, 'notebooks'>;
export type TagEntity = InstaQLEntity<AppSchema, 'tags'>;
export type ProfileEntity = InstaQLEntity<AppSchema, 'profiles'>;

// Entity with related data
export type NoteWithRelations = InstaQLEntity<AppSchema, 'notes', {
  tags: {};
  notebook: {};
}>;

export type NotebookWithNotes = InstaQLEntity<AppSchema, 'notebooks', {
  notes: {};
}>;

export type TagWithNotes = InstaQLEntity<AppSchema, 'tags', {
  notes: {};
}>;

// User type from InstantDB auth
export interface User {
  id: string;
  email: string;
  refresh_token?: string;
  profile?: ProfileEntity;
  [key: string]: any;
}

// Auth context type
export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null | undefined;
  error: Error | null;
  signIn: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}
