// components/AuthForm.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { signIn, verifyCode } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentEmail, setSentEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle email form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email);
      setSentEmail(true);
    } catch {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle code verification
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await verifyCode(email, code);
      if (onSuccess) onSuccess();
    } catch {
      setError('Invalid code. Please try again.');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {!sentEmail ? (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
            Get Started for Free
          </h2>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 text-white text-center font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button className="text-green-600 hover:underline font-medium">
                Log in
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
            Check Your Email
          </h2>
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="mb-4">
              <p className="mb-3 text-gray-600">
                We sent a verification code to <strong>{email}</strong>
              </p>
              <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter 6-digit code"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 text-white text-center font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setSentEmail(false)}
              className="w-full mt-2 py-3 px-4 bg-transparent text-gray-700 text-center font-medium rounded-md hover:bg-gray-100 focus:outline-none transition-colors"
            >
              Back to Email
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
