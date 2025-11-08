// components/AuthForm.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Verification link sent! Please check your email.');
        setEmail('');
        setPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-8 animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          {isSignUp ? 'Create account' : 'Sign in'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-fade-in">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg animate-fade-in">
              {success}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-ocean w-full py-3 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <span className="description">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Please wait…
                </span>
              ) : (
                isSignUp ? 'Sign up' : 'Sign in'
              )}
            </span>
            <div className="ocean"></div>
          </button>
        </form>
        <button
          className="btn-secondary mt-6 text-sm text-gray-400 hover:text-gray-200 transition-colors text-center w-full focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md py-2"
          onClick={() => {
            setIsSignUp((s) => !s);
            setError(null);
            setSuccess(null);
          }}
        >
          {isSignUp ? 'Have an account? Sign in' : "New here? Create account"}
        </button>
      </div>
    </div>
  );
}
