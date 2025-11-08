// app/page.tsx
import SessionGate from '@/app/SessionGate';

export default async function Page() {
  return (
    <main className="min-h-screen">
      <SessionGate />
    </main>
  );
}
