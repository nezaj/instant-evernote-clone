// contexts/NoteContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { db, id } from '../lib/db';
import { useAuth } from './AuthContext';
import { NoteEntity, NoteWithRelations, NotebookEntity, TagEntity } from '../types';

interface NoteContextType {
  notes: NoteWithRelations[];
  notebooks: NotebookEntity[];
  tags: TagEntity[];
  currentNote: NoteWithRelations | null;
  setCurrentNote: (note: NoteWithRelations | null) => void;
  createNote: (title: string, content: string, notebookId?: string, tagIds?: string[]) => Promise<NoteEntity>;
  updateNote: (id: string, updates: Partial<{ title: string; content: string; isFavorite: boolean }>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  createNotebook: (name: string, description?: string) => Promise<NotebookEntity>;
  updateNotebook: (id: string, name: string, description?: string) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  createTag: (name: string) => Promise<TagEntity>;
  deleteTag: (id: string) => Promise<void>;
  addTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  moveNoteToNotebook: (noteId: string, notebookId: string) => Promise<void>;
  toggleFavorite: (noteId: string, isFavorite: boolean) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const NoteContext = createContext<NoteContextType>({
  notes: [],
  notebooks: [],
  tags: [],
  currentNote: null,
  setCurrentNote: () => { },
  createNote: async () => ({ id: '' } as NoteEntity),
  updateNote: async () => { },
  deleteNote: async () => { },
  createNotebook: async () => ({ id: '' } as NotebookEntity),
  updateNotebook: async () => { },
  deleteNotebook: async () => { },
  createTag: async () => ({ id: '' } as TagEntity),
  deleteTag: async () => { },
  addTagToNote: async () => { },
  removeTagFromNote: async () => { },
  moveNoteToNotebook: async () => { },
  toggleFavorite: async () => { },
  isLoading: true,
  error: null,
});

interface NoteProviderProps {
  children: ReactNode;
}

export function NoteProvider({ children }: NoteProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [currentNote, setCurrentNote] = useState<NoteWithRelations | null>(null);

  // Query notes, notebooks, and tags
  const { isLoading, error, data } = db.useQuery(
    isAuthenticated && user
      ? {
        notes: {
          $: {
            where: { 'creator.id': user.id },
            order: { updatedAt: 'desc' }
          },
          tags: {},
          notebook: {},
        },
        notebooks: {
          $: {
            where: { 'creator.id': user.id },
            order: { createdAt: 'desc' }
          },
        },
        tags: {
          $: {
            where: { 'creator.id': user.id },
            order: { name: 'asc' }
          },
        },
      }
      : null
  );

  // Set notes, notebooks, and tags from query data
  const notes: NoteWithRelations[] = data?.notes || [];
  const notebooks: NotebookEntity[] = data?.notebooks || [];
  const tags: TagEntity[] = data?.tags || [];

  // Create a new note
  const createNote = async (title: string, content: string, notebookId?: string, tagIds?: string[]) => {
    if (!user) throw new Error('User not authenticated');

    const noteId = id();
    const now = new Date().toISOString();

    const tx = [
      db.tx.notes[noteId].update({
        title,
        content,
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
      }).link({ creator: user.id }),
    ];

    // Link to notebook if provided
    if (notebookId) {
      tx.push(db.tx.notebooks[notebookId].link({ notes: noteId }));
    }

    // Link to tags if provided
    if (tagIds && tagIds.length > 0) {
      tx.push(db.tx.notes[noteId].link({ tags: tagIds }));
    }

    await db.transact(tx);

    return { id: noteId, title, content, createdAt: now, updatedAt: now, isFavorite: false } as NoteEntity;
  };

  // Update a note
  const updateNote = async (id: string, updates: Partial<{ title: string; content: string; isFavorite: boolean }>) => {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.transact(db.tx.notes[id].update(updatedData));
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    await db.transact(db.tx.notes[id].delete());

    // If the deleted note is the current note, clear it
    if (currentNote && currentNote.id === id) {
      setCurrentNote(null);
    }
  };

  // Create a notebook
  const createNotebook = async (name: string, description: string = '') => {
    if (!user) throw new Error('User not authenticated');

    const notebookId = id();
    const now = new Date().toISOString();

    await db.transact(
      db.tx.notebooks[notebookId].update({
        name,
        description,
        createdAt: now,
      }).link({ creator: user.id })
    );

    return { id: notebookId, name, description, createdAt: now } as NotebookEntity;
  };

  // Update a notebook
  const updateNotebook = async (id: string, name: string, description: string = '') => {
    await db.transact(
      db.tx.notebooks[id].update({ name, description })
    );
  };

  // Delete a notebook
  const deleteNotebook = async (id: string) => {
    // Find all notes in this notebook
    const notesInNotebook = notes.filter(note => note.notebook?.id === id);

    // Create transactions to unlink all notes from this notebook
    const tx = notesInNotebook.map(note =>
      db.tx.notebooks[id].unlink({ notes: note.id })
    );

    // Add transaction to delete the notebook
    tx.push(db.tx.notebooks[id].delete());

    await db.transact(tx);
  };

  // Create a tag
  const createTag = async (name: string) => {
    if (!user) throw new Error('User not authenticated');

    const tagId = id();
    const now = new Date().toISOString();

    await db.transact(
      db.tx.tags[tagId].update({
        name,
        createdAt: now,
      }).link({ creator: user.id })
    );

    return { id: tagId, name, createdAt: now } as TagEntity;
  };

  // Delete a tag
  const deleteTag = async (id: string) => {
    // Find all notes with this tag
    const notesWithTag = notes.filter(note =>
      note.tags && note.tags.some(tag => tag.id === id)
    );

    // Create transactions to unlink all notes from this tag
    const tx = notesWithTag.map(note =>
      db.tx.notes[note.id].unlink({ tags: id })
    );

    // Add transaction to delete the tag
    tx.push(db.tx.tags[id].delete());

    await db.transact(tx);
  };

  // Add a tag to a note
  const addTagToNote = async (noteId: string, tagId: string) => {
    await db.transact(db.tx.notes[noteId].link({ tags: tagId }));
  };

  // Remove a tag from a note
  const removeTagFromNote = async (noteId: string, tagId: string) => {
    await db.transact(db.tx.notes[noteId].unlink({ tags: tagId }));
  };

  // Move a note to a notebook
  const moveNoteToNotebook = async (noteId: string, notebookId: string) => {
    const note = notes.find(n => n.id === noteId);

    // If note already has a notebook, unlink it first
    if (note && note.notebook) {
      await db.transact(db.tx.notebooks[note.notebook.id].unlink({ notes: noteId }));
    }

    // Link note to new notebook
    await db.transact(db.tx.notebooks[notebookId].link({ notes: noteId }));
  };

  // Toggle favorite status
  const toggleFavorite = async (noteId: string, isFavorite: boolean) => {
    await db.transact(
      db.tx.notes[noteId].update({
        isFavorite,
        updatedAt: new Date().toISOString()
      })
    );
  };

  const value: NoteContextType = {
    notes,
    notebooks,
    tags,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    createTag,
    deleteTag,
    addTagToNote,
    removeTagFromNote,
    moveNoteToNotebook,
    toggleFavorite,
    isLoading,
    error: error as Error | null,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNotes() {
  return useContext(NoteContext);
}
