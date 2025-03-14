// lib/db.ts
import { init, id } from '@instantdb/react';
import schema from '../instant.schema';

// Initialize InstantDB
export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '',
  schema,
});

// Type for InstantDB entities
export { id };
export type User = NonNullable<ReturnType<typeof db.useAuth>['user']>;
