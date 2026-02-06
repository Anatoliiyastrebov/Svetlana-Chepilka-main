'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Environment variable for fallback URL
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

// Safe Base64 encoding for Unicode strings
const safeEncode = (str: string): string => {
  try {
    // Convert to UTF-8 bytes, then to base64
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (e) {
    console.error('Encode error:', e);
    return '';
  }
};

// Safe Base64 decoding for Unicode strings
const safeDecode = (str: string): string => {
  try {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error('Decode error:', e);
    return '';
  }
};

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Загрузка...');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleAuth = useCallback(() => {
    try {
      setMessage('Авторизация...');
      
      // Check if Telegram WebApp is available
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        setStatus('error');
        setMessage('Telegram WebApp не доступен. Откройте эту страницу через Telegram.');
        return;
      }

      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;

      if (!user || !user.id) {
        setStatus('error');
        setMessage('Не удалось получить данные пользователя.');
        return;
      }

      // Prepare user data
      const userData = {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        auth_date: Math.floor(Date.now() / 1000),
      };
      
      // Encode user data
      const encodedUser = safeEncode(JSON.stringify(userData));
      
      if (!encodedUser) {
        setStatus('error');
        setMessage('Ошибка кодирования данных');
        return;
      }

      // Get return URL from start_param
      let returnUrl = `${WEBAPP_URL}/anketa`;
      const startParam = tg.initDataUnsafe?.start_param;
      
      console.log('Start param:', startParam);
      
      if (startParam) {
        const decodedUrl = safeDecode(startParam);
        console.log('Decoded URL:', decodedUrl);
        if (decodedUrl && decodedUrl.startsWith('http')) {
          returnUrl = decodedUrl;
        }
      }

      // Build redirect URL with encoded user data
      const url = new URL(returnUrl);
      url.searchParams.set('tg_user', encodedUser);
      
      const finalUrl = url.toString();
      console.log('Final redirect URL:', finalUrl);
      
      setRedirectUrl(finalUrl);
      setStatus('success');
      setMessage('Авторизация успешна!');

      // Redirect after delay
      setTimeout(() => {
        try {
          // Try openLink first (opens in external browser)
          if (tg.openLink) {
            console.log('Using tg.openLink');
            tg.openLink(finalUrl);
            // Close Mini App after small delay
            setTimeout(() => {
              if (tg.close) tg.close();
            }, 500);
          } else {
            // Fallback to regular redirect
            console.log('Using window.location');
            window.location.href = finalUrl;
          }
        } catch (e) {
          console.error('Redirect error:', e);
          // Fallback
          window.open(finalUrl, '_blank');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Auth error:', error);
      setStatus('error');
      setMessage('Произошла ошибка авторизации');
    }
  }, []);

  // Run auth when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      const timer = setTimeout(handleAuth, 500);
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

  const handleManualRedirect = useCallback(() => {
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }
  }, [redirectUrl]);

  return (
    <>
      {/* Load Telegram WebApp Script */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Telegram script loaded');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Script load error:', e);
          setStatus('error');
          setMessage('Не удалось загрузить Telegram WebApp.');
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
              <p className="text-sm text-gray-500 mb-4">
                Открытие браузера...
              </p>
              {redirectUrl && (
                <button
                  onClick={handleManualRedirect}
                  className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Открыть анкету вручную
                </button>
              )}
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
