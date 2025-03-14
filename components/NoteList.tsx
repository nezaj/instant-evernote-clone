// components/NoteList.tsx
import { useState } from 'react';
import { useNotes } from '../contexts/NoteContext';
import { NoteWithRelations } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function NoteList() {
  const { notes, notebooks, createNote, setCurrentNote, currentNote } = useNotes();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Filter notes by search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get notebook name for a note
  const getNotebookName = (note: NoteWithRelations) => {
    return note.notebook?.name || 'No Notebook';
  };

  // Handle creating a new note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !user) return;

    try {
      // Use the first notebook if it exists, otherwise don't assign a notebook
      const defaultNotebookId = notebooks.length > 0 ? notebooks[0].id : undefined;

      const note = await createNote(newNoteTitle, '', defaultNotebookId);
      setNewNoteTitle('');
      setIsCreating(false);

      // Set the new note as the current note
      const fullNote = {
        ...note,
        tags: [],
        notebook: defaultNotebookId ? notebooks[0] : undefined,
      } as NoteWithRelations;

      setCurrentNote(fullNote);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  // Get excerpt from note content
  const getExcerpt = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      {/* Search and create */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Note
        </button>
      </div>

      {/* Note creation form */}
      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateNote}>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Note list */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No notes match your search' : 'No notes yet'}
          </div>
        ) : (
          <ul>
            {filteredNotes.map((note) => (
              <li
                key={note.id}
                onClick={() => setCurrentNote(note)}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${currentNote?.id === note.id ? 'bg-green-50' : ''
                  }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {note.title}
                    </h3>
                    {note.isFavorite && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {getExcerpt(note.content)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getNotebookName(note)}</span>
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
