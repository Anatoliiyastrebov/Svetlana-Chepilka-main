'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Environment variable for fallback URL
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

// Safe Base64 encoding for Unicode strings
const safeEncode = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  } catch {
    return '';
  }
};

// Safe Base64 decoding for Unicode strings
const safeDecode = (str: string): string => {
  try {
    return decodeURIComponent(
      Array.from(atob(str))
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
};

// Validate URL to prevent open redirect attacks
const isValidReturnUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow same domain or vercel.app
    const allowedHosts = [
      'svetlana-chepilka-main.vercel.app',
      'localhost',
      '127.0.0.1',
    ];
    return allowedHosts.some(host => 
      parsed.hostname === host || parsed.hostname.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
};

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Загрузка...');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleAuth = useCallback(() => {
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

      if (!user || !user.id || !user.first_name) {
        setStatus('error');
        setMessage('Не удалось получить данные пользователя. Убедитесь, что открыли через Telegram.');
        return;
      }

      // Prepare user data (sanitize strings)
      const userData = {
        id: user.id,
        first_name: String(user.first_name || '').slice(0, 100),
        last_name: String(user.last_name || '').slice(0, 100),
        username: String(user.username || '').slice(0, 50),
        auth_date: Math.floor(Date.now() / 1000),
      };
      
      // Encode user data
      const encodedUser = safeEncode(JSON.stringify(userData));
      
      if (!encodedUser) {
        setStatus('error');
        setMessage('Ошибка кодирования данных');
        return;
      }

      setStatus('success');
      setMessage('Авторизация успешна!');

      // Get return URL from start_param
      let returnUrl = `${WEBAPP_URL}/anketa`;
      const startParam = tg.initDataUnsafe.start_param;
      
      if (startParam) {
        const decodedUrl = safeDecode(startParam);
        if (decodedUrl && isValidReturnUrl(decodedUrl)) {
          returnUrl = decodedUrl;
        }
      }

      // Build redirect URL with encoded user data
      const url = new URL(returnUrl);
      url.searchParams.set('tg_user', encodedUser);

      // Redirect after short delay
      const redirectTimer = setTimeout(() => {
        try {
          tg.openLink(url.toString());
          setTimeout(() => tg.close(), 300);
        } catch (e) {
          // Fallback: just close and hope user returns manually
          console.error('Failed to open link:', e);
          tg.close();
        }
      }, 1200);

      // Cleanup on unmount
      return () => clearTimeout(redirectTimer);
      
    } catch (error) {
      console.error('Auth error:', error);
      setStatus('error');
      setMessage('Произошла ошибка авторизации');
    }
  }, []);

  // Run auth when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      const timer = setTimeout(handleAuth, 300);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, handleAuth]);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    setMessage('Повторная попытка...');
    setTimeout(handleAuth, 500);
  }, [handleAuth]);

  const handleClose = useCallback(() => {
    window.Telegram?.WebApp?.close();
  }, []);

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
              <p className="text-gray-600 mb-2">{message}</p>
              <p className="text-sm text-gray-500">
                Перенаправление в браузер...
              </p>
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
                  onClick={handleRetry}
                  className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Попробовать снова
                </button>
                <button
                  onClick={handleClose}
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
