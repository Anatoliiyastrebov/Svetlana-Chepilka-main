'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'done'>('processing');

  useEffect(() => {
    const tgUser = searchParams.get('tg_user');
    
    if (tgUser) {
      try {
        // Save encoded user data to localStorage
        // The original tab will detect this via 'storage' event
        localStorage.setItem('telegram_auth_data', tgUser);
        localStorage.setItem('telegram_auth_timestamp', Date.now().toString());
        
        setStatus('done');
        
        // Close this window/tab after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } catch (e) {
        console.error('Error saving auth data:', e);
        setStatus('done');
      }
    } else {
      setStatus('done');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Обработка...</p>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Авторизация завершена!
            </h1>
            <p className="text-gray-600 mb-4">
              Вернитесь к вкладке с анкетой — данные уже подтянулись.
            </p>
            <p className="text-sm text-gray-400">
              Это окно закроется автоматически...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
