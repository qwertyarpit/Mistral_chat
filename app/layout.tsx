// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mistral Chat',
  description: 'Minimal ChatGPT-style app with Mistral + Supabase Auth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
