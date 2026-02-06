'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Get webapp URL from environment
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Авторизация...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Wait for Telegram WebApp to be ready
        if (!window.Telegram?.WebApp) {
          setStatus('error');
          setMessage('Telegram WebApp не доступен. Откройте через Telegram.');
          return;
        }

        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe.user;
        const sessionId = tg.initDataUnsafe.start_param;

        if (!user) {
          setStatus('error');
          setMessage('Не удалось получить данные пользователя');
          return;
        }

        if (!sessionId) {
          setStatus('error');
          setMessage('Отсутствует ID сессии');
          return;
        }

        // Save user data to session
        const response = await fetch('/api/auth/save-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              language_code: user.language_code,
              is_premium: user.is_premium,
              photo_url: user.photo_url,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Авторизация успешна! Перенаправление...');

          // Redirect back to the webapp with auth token
          setTimeout(() => {
            const redirectUrl = `${WEBAPP_URL}?auth_token=${sessionId}`;
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Ошибка сохранения данных');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setStatus('error');
        setMessage('Произошла ошибка авторизации');
      }
    };

    // Small delay to ensure Telegram WebApp is loaded
    const timer = setTimeout(handleAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Авторизация
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Успешно!
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Ошибка
            </h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => window.Telegram?.WebApp?.close()}
              className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Закрыть
            </button>
          </>
        )}
      </div>
    </div>
  );
}
