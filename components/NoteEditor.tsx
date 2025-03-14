// components/NoteEditor.tsx
import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NoteContext';

export default function NoteEditor() {
  const {
    currentNote,
    updateNote,
    deleteNote,
    notebooks,
    tags,
    toggleFavorite,
    moveNoteToNotebook,
    addTagToNote,
    removeTagFromNote,
  } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotebookDropdown, setShowNotebookDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update local state when current note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  // Save note with debounce
  const saveNote = async () => {
    if (!currentNote) return;

    setIsSaving(true);
    try {
      await updateNote(currentNote.id, { title, content });
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle content change with debounce
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for autosave
    const timeout = setTimeout(() => {
      saveNote();
    }, 1000);

    setDebounceTimeout(timeout);
  };

  // Handle title change and save
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for autosave
    const timeout = setTimeout(() => {
      saveNote();
    }, 1000);

    setDebounceTimeout(timeout);
  };

  // Handle deleting the note
  const handleDeleteNote = async () => {
    if (!currentNote) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(currentNote.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  // Handle toggling favorite status
  const handleToggleFavorite = async () => {
    if (!currentNote) return;

    try {
      await toggleFavorite(currentNote.id, !currentNote.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Handle moving note to a notebook
  const handleMoveToNotebook = async (notebookId: string) => {
    if (!currentNote) return;

    try {
      await moveNoteToNotebook(currentNote.id, notebookId);
      setShowNotebookDropdown(false);
    } catch (error) {
      console.error('Failed to move note:', error);
    }
  };

  // Handle adding a tag to a note
  const handleAddTag = async (tagId: string) => {
    if (!currentNote) return;

    // Check if tag is already added
    const hasTag = currentNote.tags && currentNote.tags.some(tag => tag.id === tagId);
    if (hasTag) return;

    try {
      await addTagToNote(currentNote.id, tagId);
      setShowTagDropdown(false);
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  // Handle removing a tag from a note
  const handleRemoveTag = async (tagId: string) => {
    if (!currentNote) return;

    try {
      await removeTagFromNote(currentNote.id, tagId);
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // If no note is selected
  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a note or create a new one
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Note toolbar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className="text-gray-500 hover:text-yellow-500"
            title={currentNote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {currentNote.isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )}
          </button>

          {/* Notebook dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotebookDropdown(!showNotebookDropdown)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
              <span className="truncate max-w-[200px]">
                {currentNote.notebook ? currentNote.notebook.name : 'No Notebook'}
              </span>
            </button>

            {showNotebookDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
                <ul className="py-1">
                  {notebooks.map((notebook) => (
                    <li key={notebook.id}>
                      <button
                        onClick={() => handleMoveToNotebook(notebook.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentNote.notebook?.id === notebook.id ? 'font-semibold bg-gray-50' : ''
                          }`}
                      >
                        {notebook.name}
                      </button>
                    </li>
                  ))}
                  {notebooks.length === 0 && (
                    <li className="px-4 py-2 text-sm text-gray-500">No notebooks</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Tag dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              Add Tags
            </button>

            {showTagDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
                <ul className="py-1">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <button
                        onClick={() => handleAddTag(tag.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentNote.tags?.some(t => t.id === tag.id) ? 'font-semibold bg-gray-50' : ''
                          }`}
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
                  {tags.length === 0 && (
                    <li className="px-4 py-2 text-sm text-gray-500">No tags</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDeleteNote}
          className="text-gray-500 hover:text-red-500"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Note content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Tags */}
        {currentNote.tags && currentNote.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentNote.tags.map((tag) => (
              <div key={tag.id} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                <span className="text-gray-700">{tag.name}</span>
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="w-full mb-2 text-2xl font-bold border-b border-transparent focus:border-gray-300 focus:outline-none pb-2"
        />

        {/* Last updated */}
        <div className="text-xs text-gray-500 mb-4">
          Last updated: {formatDate(currentNote.updatedAt)}
          {isSaving && <span className="ml-2">(Saving...)</span>}
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your note here..."
          className="w-full h-full min-h-[300px] focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
