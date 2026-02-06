'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle, UserCheck, ExternalLink } from 'lucide-react';

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
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
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
      
      console.log('start_param:', startParam);
      
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
      console.log('Final URL:', finalUrl);
      
      setRedirectUrl(finalUrl);
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

    const tg = window.Telegram?.WebApp;
    
    console.log('Opening URL:', redirectUrl);

    try {
      // Try to open link in external browser
      if (tg?.openLink) {
        tg.openLink(redirectUrl, { try_instant_view: false });
      } else {
        // Fallback - open in new tab
        window.open(redirectUrl, '_blank');
      }
      
      // Show success and close button
      setStatus('success');
      setMessage('Ссылка открыта в браузере');
      
    } catch (e) {
      console.error('Open link error:', e);
      // Fallback
      window.open(redirectUrl, '_blank');
      setStatus('success');
      setMessage('Ссылка открыта');
    }
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

  // Retry opening link
  const handleOpenAgain = useCallback(() => {
    if (redirectUrl) {
      const tg = window.Telegram?.WebApp;
      if (tg?.openLink) {
        tg.openLink(redirectUrl, { try_instant_view: false });
      } else {
        window.open(redirectUrl, '_blank');
      }
    }
  }, [redirectUrl]);

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
                Нажмите кнопку для подтверждения и перехода к анкете
              </p>
              <button
                onClick={handleConfirm}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors text-lg flex items-center justify-center gap-2"
              >
                <span>Подтвердить и перейти</span>
                <ExternalLink className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Success - link opened */}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Готово!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={handleOpenAgain}
                  className="w-full px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Открыть ещё раз</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-900 rounded-xl text-white font-medium transition-colors"
                >
                  Закрыть это окно
                </button>
              </div>
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
