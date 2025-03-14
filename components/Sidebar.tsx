// components/Sidebar.tsx
import { useState } from 'react';
import { useNotes } from '../contexts/NoteContext';
import { useAuth } from '../contexts/AuthContext';
import { NotebookEntity, TagEntity } from '../types';

export default function Sidebar() {
  const { notebooks, tags, notes, createNotebook, createTag, setCurrentNote } = useNotes();
  const { user, signOut } = useAuth();
  const [showNotebooks, setShowNotebooks] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [addingNotebook, setAddingNotebook] = useState(false);
  const [addingTag, setAddingTag] = useState(false);

  // Filter notes by favorite status
  const favoriteNotes = notes.filter(note => note.isFavorite);

  // Handle adding a new notebook
  const handleAddNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;

    try {
      await createNotebook(newNotebookName);
      setNewNotebookName('');
      setAddingNotebook(false);
    } catch (error) {
      console.error('Failed to create notebook:', error);
    }
  };

  // Handle adding a new tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName);
      setNewTagName('');
      setAddingTag(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  // Handle notebook click
  const handleNotebookClick = (notebook: NotebookEntity) => {
    // Find the first note in the notebook and set it as current note
    const notebookNote = notes.find(note => note.notebook?.id === notebook.id);
    if (notebookNote) {
      setCurrentNote(notebookNote);
    }
  };

  // Handle tag click
  const handleTagClick = (tag: TagEntity) => {
    // Find the first note with the tag and set it as current note
    const taggedNote = notes.find(note =>
      note.tags && note.tags.some(t => t.id === tag.id)
    );
    if (taggedNote) {
      setCurrentNote(taggedNote);
    }
  };

  return (
    <aside className="w-64 h-full bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* User info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {user?.email}
            </h2>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-4">
          {/* All notes section */}
          <div>
            <button
              onClick={() => setCurrentNote(notes[0] || null)}
              className="flex items-center w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-200 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              All Notes <span className="ml-1 text-gray-500 text-sm">({notes.length})</span>
            </button>
          </div>

          {/* Favorites section */}
          <div>
            <button
              onClick={() => favoriteNotes.length > 0 && setCurrentNote(favoriteNotes[0])}
              className="flex items-center w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-200 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Favorites <span className="ml-1 text-gray-500 text-sm">({favoriteNotes.length})</span>
            </button>
          </div>

          {/* Notebooks section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowNotebooks(!showNotebooks)}
                className="flex items-center text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
                Notebooks <span className="ml-1 text-gray-500 text-sm">({notebooks.length})</span>
              </button>
              <button
                onClick={() => setAddingNotebook(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>

            {showNotebooks && (
              <div className="ml-5 space-y-1">
                {addingNotebook && (
                  <form onSubmit={handleAddNotebook} className="mb-2">
                    <input
                      type="text"
                      value={newNotebookName}
                      onChange={(e) => setNewNotebookName(e.target.value)}
                      placeholder="Notebook name"
                      className="w-full px-2 py-1 text-sm border rounded"
                      autoFocus
                    />
                    <div className="flex mt-1 space-x-1">
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingNotebook(false)}
                        className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {notebooks.map((notebook) => (
                  <button
                    key={notebook.id}
                    onClick={() => handleNotebookClick(notebook)}
                    className="flex items-center w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-200 rounded"
                  >
                    <span className="truncate">{notebook.name}</span>
                  </button>
                ))}

                {notebooks.length === 0 && !addingNotebook && (
                  <div className="text-sm text-gray-500">No notebooks yet</div>
                )}
              </div>
            )}
          </div>

          {/* Tags section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowTags(!showTags)}
                className="flex items-center text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Tags <span className="ml-1 text-gray-500 text-sm">({tags.length})</span>
              </button>
              <button
                onClick={() => setAddingTag(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>

            {showTags && (
              <div className="ml-5 space-y-1">
                {addingTag && (
                  <form onSubmit={handleAddTag} className="mb-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Tag name"
                      className="w-full px-2 py-1 text-sm border rounded"
                      autoFocus
                    />
                    <div className="flex mt-1 space-x-1">
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingTag(false)}
                        className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag)}
                    className="flex items-center w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-200 rounded"
                  >
                    <span className="truncate">{tag.name}</span>
                  </button>
                ))}

                {tags.length === 0 && !addingTag && (
                  <div className="text-sm text-gray-500">No tags yet</div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
