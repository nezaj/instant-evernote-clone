// components/Layout.tsx
import { ReactNode } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Evernote Clone' }: LayoutProps) {
  const { isLoading } = useAuth();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="An Evernote clone built with Next.js and InstantDB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-white">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <main className="min-h-screen">{children}</main>
        )}
      </div>
    </>
  );
}
