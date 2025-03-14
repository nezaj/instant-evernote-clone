// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { NoteProvider } from '../contexts/NoteContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NoteProvider>
        <Component {...pageProps} />
      </NoteProvider>
    </AuthProvider>
  );
}
