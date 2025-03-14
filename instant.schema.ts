// instant.schema.ts
import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      displayName: i.string(),
      createdAt: i.date().indexed(),
    }),
    notes: i.entity({
      title: i.string().indexed(),
      content: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
      isFavorite: i.boolean().indexed(),
    }),
    notebooks: i.entity({
      name: i.string().indexed(),
      description: i.string(),
      createdAt: i.date().indexed(),
    }),
    tags: i.entity({
      name: i.string().unique().indexed(),
      createdAt: i.date().indexed(),
    }),
  },
  links: {
    // Link profiles to users
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    // Link notes to users (creator)
    noteCreator: {
      forward: { on: 'notes', has: 'one', label: 'creator' },
      reverse: { on: '$users', has: 'many', label: 'notes' },
    },
    // Link notebooks to users (creator)
    notebookCreator: {
      forward: { on: 'notebooks', has: 'one', label: 'creator' },
      reverse: { on: '$users', has: 'many', label: 'notebooks' },
    },
    // Link notes to notebooks
    notebookNotes: {
      forward: { on: 'notebooks', has: 'many', label: 'notes' },
      reverse: { on: 'notes', has: 'one', label: 'notebook' },
    },
    // Link notes to tags
    noteTags: {
      forward: { on: 'notes', has: 'many', label: 'tags' },
      reverse: { on: 'tags', has: 'many', label: 'notes' },
    },
    // Link tags to users (creator)
    tagCreator: {
      forward: { on: 'tags', has: 'one', label: 'creator' },
      reverse: { on: '$users', has: 'many', label: 'tags' },
    },
  },
});

// TypeScript helpers
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
