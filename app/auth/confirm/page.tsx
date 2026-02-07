'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle, UserCheck } from 'lucide-react';

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

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Загрузка...');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const prepareAuth = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        setStatus('error');
        setMessage('Telegram WebApp не доступен. Откройте через Telegram.');
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

      setUserName(user.first_name + (user.last_name ? ' ' + user.last_name : ''));

      const userData = {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        auth_date: Math.floor(Date.now() / 1000),
      };

      const encodedUser = safeEncode(JSON.stringify(userData));
      if (!encodedUser) {
        setStatus('error');
        setMessage('Ошибка кодирования данных');
        return;
      }

      // Decode startapp params: path|lang|type
      let returnPath = '/anketa';
      let returnLang = 'ru';
      let returnType = 'infant';
      const startParam = tg.initDataUnsafe?.start_param;

      if (startParam) {
        try {
          const decoded = atob(startParam);
          const [path, lang, type] = decoded.split('|');
          if (path) returnPath = path;
          if (lang) returnLang = lang;
          if (type) returnType = type;
        } catch {}
      }

      // Build URL to the questionnaire with auth data
      const url = `${WEBAPP_URL}${returnPath}?lang=${returnLang}&type=${returnType}&tg_user=${encodedUser}`;
      setRedirectUrl(url);
      setStatus('ready');
    } catch (error) {
      console.error('Auth error:', error);
      setStatus('error');
      setMessage('Произошла ошибка');
    }
  }, []);

  // Confirm — open questionnaire in browser, close Mini App
  const handleConfirm = useCallback(() => {
    if (!redirectUrl) return;

    const tg = window.Telegram?.WebApp;

    try {
      if (tg?.openLink) {
        tg.openLink(redirectUrl, { try_instant_view: false });
      } else {
        window.open(redirectUrl, '_blank');
      }

      setStatus('success');
      setMessage('Авторизация завершена!');

      // Close Mini App after 3 seconds
      setTimeout(() => { tg?.close(); }, 3000);
    } catch (e) {
      console.error('Redirect error:', e);
      window.open(redirectUrl, '_blank');
      setStatus('success');
    }
  }, [redirectUrl]);

  useEffect(() => {
    if (scriptLoaded) {
      const timer = setTimeout(prepareAuth, 300);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, prepareAuth]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => { setStatus('error'); setMessage('Не удалось загрузить Telegram WebApp.'); }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Авторизация</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'ready' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Авторизация через Telegram</h1>
              {userName && (
                <p className="text-gray-600 mb-4">Вы входите как <strong>{userName}</strong></p>
              )}
              <p className="text-gray-500 text-sm mb-6">Нажмите для подтверждения и возврата к анкете</p>
              <button onClick={handleConfirm}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors text-lg">
                Подтвердить авторизацию
              </button>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Готово!</h1>
              <p className="text-gray-600 mb-2">{message}</p>
              <p className="text-sm text-gray-400">Анкета открыта в браузере. Это окно закроется...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Ошибка</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button onClick={() => { setStatus('loading'); setTimeout(prepareAuth, 300); }}
                  className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors">
                  Попробовать снова
                </button>
                <button onClick={() => window.Telegram?.WebApp?.close()}
                  className="w-full px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
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
