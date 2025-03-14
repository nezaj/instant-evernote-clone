// pages/login.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to home if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <Layout title="Login - Evernote Clone">
      <div className="min-h-screen flex flex-col bg-[#f8f8f5]">
        {/* Header */}
        <header className="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="text-green-600 h-10 w-10 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="currentColor">
                <path d="M25.3,18.1c-0.9-0.3-1.8-0.6-2.1-1.2c-0.4-0.6-0.4-1.5-0.4-2.7c0-1.1,0.1-3,0-4.1c0-1.4-1.1-2.2-2-2.2c-0.6,0-1.1,0.3-1.5,0.7 c-0.9,1.2-0.5,3.1-0.7,5c-0.1,1-0.4,0.4-0.8-0.2c-0.4-0.5-0.8-2.2-1.6-3.1c-1.5-1.6-5.3-1.5-5.3,1.6c0,0.7,0,1.3,0,2 c0,2,0,4,0.1,5.9c0,0.7,0.2,1.8-0.4,2c-1.4,0.6-3.8,0.1-3.8,2.3c0,1.2,0.9,1.6,1.7,1.6c0.5,0,0.7-0.1,1.1-0.1c2.2-0.5,5.4-0.5,7.8-0.5 c2.4,0,5.5,0.6,7.4-0.3c1.3-0.6,2.4-1.2,2.4-2.4C27.4,19.3,26.5,18.5,25.3,18.1z M15.2,19.6c-0.8,0-1.5-0.7-1.5-1.5 c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5C16.7,18.9,16,19.6,15.2,19.6z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Evernote Clone</h1>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full text-center mb-10">
            <h2 className="text-5xl font-light mb-4">
              <span className="text-black">What will you </span>
              <span className="text-green-600">achieve</span>
              <span className="text-black"> today?</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Remember everything and tackle any project with your notes, tasks, and schedule all in one place.
            </p>
          </div>

          <div className="w-full max-w-md">
            <AuthForm onSuccess={handleLoginSuccess} />

            <div className="mt-6 text-center text-gray-600">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Evernote Clone. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
}
