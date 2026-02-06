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

      if (!user) {
        setStatus('error');
        setMessage('Не удалось получить данные пользователя. Убедитесь, что открыли через Telegram.');
        return;
      }

      setStatus('success');
      setMessage('Авторизация успешна! Перенаправление...');

      // Encode user data directly in URL (no server session needed)
      const userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || '',
        username: user.username || '',
      };
      
      // Base64 encode the user data
      const encodedUser = btoa(encodeURIComponent(JSON.stringify(userData)));

      // Get return URL from start_param (passed from the website)
      let returnUrl = WEBAPP_URL;
      const startParam = tg.initDataUnsafe.start_param;
      
      if (startParam) {
        try {
          // Decode the return URL from start_param
          returnUrl = decodeURIComponent(atob(startParam));
        } catch {
          // If decoding fails, use default URL
          console.error('Failed to decode return URL');
        }
      }

      // Build redirect URL with encoded user data
      const url = new URL(returnUrl);
      url.searchParams.set('tg_user', encodedUser);
      
      // Redirect back to the webapp
      setTimeout(() => {
        window.location.href = url.toString();
      }, 1000);
      
    } catch (error) {
      console.error('Auth error:', error);
      setStatus('error');
      setMessage('Произошла ошибка авторизации');
    }
  };

  // Run auth when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
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
