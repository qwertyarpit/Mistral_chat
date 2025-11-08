# Mistral Chat MVP

A chat app built with Next.js (App Router) and Supabase Auth, powered by Mistral AI.

## Features

- ✅ Email/password authentication via Supabase
- ✅ Server-side Mistral API integration
- ✅ Clean, modern chat interface
- ✅ Session-based message storage (in-memory)

## Prerequisites

- Node.js 18+
- A Supabase project with Auth enabled
- A Mistral API key

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local` file** in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MISTRAL_API_KEY=sk_mistral_xxx
   MISTRAL_MODEL=mistral-small-latest
   ```


3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign up with your email and password
2. Start chatting with Mistral AI
3. Messages are stored in-memory per session (refresh to clear)

## Project Structure

```
mistral-chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Mistral API endpoint (server-only)
│   ├── SessionGate.tsx            # Session-based routing
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── AuthForm.tsx              # Sign in/up form
│   └── Chat.tsx                   # Chat interface
└── lib/
    └── supabaseClient.ts          # Supabase client
```

