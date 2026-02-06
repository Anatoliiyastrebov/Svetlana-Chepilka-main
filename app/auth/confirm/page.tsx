'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle, UserCheck } from 'lucide-react';

// Environment variable for fallback URL
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

// Safe Base64 encoding for Unicode strings
const safeEncode = (str: string): string => {
  try {
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
  const [status, setStatus] = useState<'loading' | 'ready' | 'redirecting' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Загрузка...');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  // Prepare auth data when script loads
  const prepareAuth = useCallback(() => {
    try {
      setMessage('Подготовка...');
      
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

      // Set user name for display
      const displayName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
      setUserName(displayName);

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
      
      if (startParam) {
        const decodedUrl = safeDecode(startParam);
        if (decodedUrl && decodedUrl.startsWith('http')) {
          returnUrl = decodedUrl;
        }
      }

      // Build redirect URL with encoded user data
      const url = new URL(returnUrl);
      url.searchParams.set('tg_user', encodedUser);
      
      setRedirectUrl(url.toString());
      setStatus('ready');
      setMessage('Готово к авторизации');
      
    } catch (error) {
      console.error('Auth error:', error);
      setStatus('error');
      setMessage('Произошла ошибка');
    }
  }, []);

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    if (!redirectUrl) return;
    
    setStatus('redirecting');
    setMessage('Переход к анкете...');

    const tg = window.Telegram?.WebApp;

    // Redirect after short delay
    setTimeout(() => {
      try {
        if (tg?.openLink) {
          tg.openLink(redirectUrl);
          // Close Mini App after 3 seconds
          setTimeout(() => {
            setStatus('success');
            setMessage('Готово!');
            setTimeout(() => {
              if (tg?.close) tg.close();
            }, 2000);
          }, 1000);
        } else {
          window.open(redirectUrl, '_blank');
        }
      } catch (e) {
        console.error('Redirect error:', e);
        window.open(redirectUrl, '_blank');
      }
    }, 500);
  }, [redirectUrl]);

  // Run prepare when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      const timer = setTimeout(prepareAuth, 300);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, prepareAuth]);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    setMessage('Повторная попытка...');
    setTimeout(prepareAuth, 300);
  }, [prepareAuth]);

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
          setMessage('Не удалось загрузить Telegram WebApp.');
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          
          {/* Loading */}
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Авторизация
              </h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {/* Ready - show confirm button */}
          {status === 'ready' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Авторизация через Telegram
              </h1>
              {userName && (
                <p className="text-gray-600 mb-4">
                  Вы входите как <strong>{userName}</strong>
                </p>
              )}
              <p className="text-gray-500 text-sm mb-6">
                Нажмите кнопку для подтверждения авторизации и возврата к анкете
              </p>
              <button
                onClick={handleConfirm}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors text-lg"
              >
                Подтвердить авторизацию
              </button>
            </>
          )}

          {/* Redirecting */}
          {status === 'redirecting' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Переход...
              </h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Готово!
              </h1>
              <p className="text-gray-600">Окно закроется автоматически...</p>
            </>
          )}

          {/* Error */}
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
