'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Get webapp URL from environment (fallback)
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Загрузка...');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleAuth = async () => {
    try {
      setMessage('Авторизация...');
      
      // Check if Telegram WebApp is available
      if (!window.Telegram?.WebApp) {
        setStatus('error');
        setMessage('Telegram WebApp не доступен. Откройте эту страницу через Telegram.');
        return;
      }

      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe.user;
      const sessionId = tg.initDataUnsafe.start_param;

      if (!user) {
        setStatus('error');
        setMessage('Не удалось получить данные пользователя. Убедитесь, что открыли через Telegram.');
        return;
      }

      if (!sessionId) {
        setStatus('error');
        setMessage('Отсутствует ID сессии. Попробуйте снова с главной страницы.');
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

        // Get return URL from localStorage or use default
        let returnUrl = WEBAPP_URL;
        try {
          // Try to access localStorage (may not work in Telegram WebApp context)
          const savedUrl = localStorage.getItem('telegram_auth_return_url');
          if (savedUrl) {
            // Parse URL and add auth_token
            const url = new URL(savedUrl);
            url.searchParams.set('auth_token', sessionId);
            returnUrl = url.toString();
            localStorage.removeItem('telegram_auth_return_url');
          } else {
            returnUrl = `${WEBAPP_URL}?auth_token=${sessionId}`;
          }
        } catch {
          // localStorage not available, use default
          returnUrl = `${WEBAPP_URL}?auth_token=${sessionId}`;
        }

        // Redirect back to the webapp with auth token
        setTimeout(() => {
          window.location.href = returnUrl;
        }, 1000);
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

  // Run auth when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      // Small delay to ensure Telegram WebApp is fully initialized
      const timer = setTimeout(handleAuth, 300);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded]);

  return (
    <>
      {/* Load Telegram WebApp Script */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          setStatus('error');
          setMessage('Не удалось загрузить Telegram WebApp. Проверьте интернет-соединение.');
        }}
      />
      
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
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStatus('loading');
                    setMessage('Повторная попытка...');
                    setTimeout(handleAuth, 500);
                  }}
                  className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Попробовать снова
                </button>
                <button
                  onClick={() => window.Telegram?.WebApp?.close()}
                  className="w-full px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
