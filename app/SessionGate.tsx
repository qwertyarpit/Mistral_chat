// app/SessionGate.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AuthForm from '@/components/AuthForm';
import Chat from '@/components/Chat';

export default function SessionGate() {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setLoading(false);
      supabase.auth.onAuthStateChange((_e, session) => setHasSession(!!session));
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm">Loading…</p>
        </div>
      </div>
    );
  }
  return hasSession ? <Chat /> : <AuthForm />;
}

