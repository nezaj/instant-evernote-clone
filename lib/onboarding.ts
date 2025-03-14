// lib/onboarding.ts
import { db, id } from './db';
import { User } from '../types';

// Function to seed a new user with helpful notes
export async function seedUserWithOnboardingNotes(user: User) {
  if (!user || !user.id) {
    console.error('Cannot seed notes: User is undefined or missing ID');
    return;
  }

  try {
    // Create a default notebook first
    const notebookId = id();
    const now = new Date().toISOString();

    // Create the notebook
    await db.transact(
      db.tx.notebooks[notebookId].update({
        name: 'Getting Started',
        description: 'Introduction to the Evernote Clone',
        createdAt: now,
      }).link({ creator: user.id })
    );

    // Create welcome notes with helpful information
    const welcomeNotes = [
      {
        title: '👋 Welcome to Evernote Clone!',
        content: `Welcome to your new Evernote Clone!

This application provides a simple and effective way to capture and organize your thoughts, ideas, and information.

Here are a few things you can do:
- Create and edit notes
- Organize notes into notebooks
- Tag notes for easy searching
- Favorite important notes

Feel free to delete these notes or keep them for reference. Let's get started!`,
      },
      {
        title: '📝 Creating and Editing Notes',
        content: `# Creating Notes

To create a new note, click the "New Note" button in the note list panel.

# Editing Notes

Notes are automatically saved as you type. You can edit:
- The title of the note
- The content of the note

# Formatting (Future Enhancement)
We're working on adding rich text formatting in a future update. For now, your notes are saved as plain text.

# Deleting Notes
To delete a note, click the trash icon in the top-right corner of the note editor. Be careful, as this action cannot be undone.`,
      },
      {
        title: '📚 Using Notebooks',
        content: `Notebooks help you organize your notes by topic, project, or category.

# Creating Notebooks
1. Click the + icon next to "Notebooks" in the sidebar
2. Enter a name for your notebook
3. Click "Add"

# Moving Notes to Notebooks
1. Open the note you want to move
2. Click on the notebook name in the toolbar (or "No Notebook" if it's not in a notebook yet)
3. Select the destination notebook from the dropdown

# Organizing Tips
- Use notebooks for broad categories (Work, Personal, Projects)
- Use tags for more specific labeling within notebooks`,
      },
      {
        title: '🏷️ Using Tags',
        content: `Tags provide a flexible way to categorize your notes across notebooks.

# Adding Tags
1. Open the note you want to tag
2. Click "Add Tags" in the toolbar
3. Select existing tags or create new ones

# Creating New Tags
1. Click the + icon next to "Tags" in the sidebar
2. Enter a name for your tag
3. Click "Add"

# Finding Tagged Notes
Click on any tag in the sidebar to see all notes with that tag.

# Tag Tips
- Use tags for cross-notebook organization
- Add multiple tags to notes for more flexible organization
- Tags are especially useful for project-specific content that spans multiple notebooks`,
      },
      {
        title: '⭐ Tips and Tricks',
        content: `# Favorites
Mark important notes as favorites by clicking the star icon in the toolbar.

# Search
Use the search bar to quickly find notes by title or content.

# Automatic Saving
Your notes are automatically saved as you type, so you never have to worry about losing your work.

# Keyboard Shortcuts (Coming Soon)
We're working on adding keyboard shortcuts to make navigation and note creation even faster.

# Feedback
We're constantly improving the app. If you have suggestions or find bugs, please let us know!

Thanks for using Evernote Clone!`,
      },
    ];

    // Create the notes and link them to the notebook
    const transactions = welcomeNotes.map((note, index) => {
      const noteId = id();
      return db.tx.notes[noteId]
        .update({
          title: note.title,
          content: note.content,
          createdAt: now,
          updatedAt: now,
          isFavorite: index === 0, // Make the first note a favorite
        })
        .link({
          creator: user.id,
          notebook: notebookId
        });
    });

    // Execute all note creation transactions
    await db.transact(transactions);

    console.log('Successfully created onboarding notes for new user');
  } catch (error) {
    console.error('Failed to create onboarding notes:', error);
  }
}
