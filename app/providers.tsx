'use client';

import { Suspense } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sonner position="top-center" />
      <Suspense fallback={<LoadingFallback />}>
        <LanguageProvider>{children}</LanguageProvider>
      </Suspense>
    </>
  );
}
