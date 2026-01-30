import { ReactNode } from 'react';
import { AdminNav } from './AdminNav';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="safe-bottom">
        {children}
      </main>
      <AdminNav />
    </div>
  );
}
