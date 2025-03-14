// pages/index.tsx
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNotes } from '../contexts/NoteContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { notes, setCurrentNote } = useNotes();
  const router = useRouter();

  // Set first note as current note when notes load
  useEffect(() => {
    if (notes.length > 0) {
      setCurrentNote(notes[0]);
    }
  }, [notes, setCurrentNote]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Evernote Clone">
      <div className="h-screen flex">
        <Sidebar />
        <div className="w-72 h-full">
          <NoteList />
        </div>
        <div className="flex-1 h-full">
          <NoteEditor />
        </div>
      </div>
    </Layout>
  );
}
