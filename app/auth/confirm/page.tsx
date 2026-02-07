'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Script from 'next/script';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://svetlana-chepilka-main.vercel.app';

const safeEncode = (str: string): string => {
  try {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (e) {
    return '';
  }
};

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('Авторизация...');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userName, setUserName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAuth = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        setStatus('error');
        setMessage('Откройте через Telegram.');
        return;
      }

      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (!user || !user.id) {
        setStatus('error');
        setMessage('Не удалось получить данные.');
        return;
      }

      setUserName(user.first_name + (user.last_name ? ' ' + user.last_name : ''));

      const encoded = safeEncode(JSON.stringify({
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        auth_date: Math.floor(Date.now() / 1000),
      }));

      if (!encoded) { setStatus('error'); setMessage('Ошибка'); return; }

      let lang = 'ru', type = 'infant';
      const sp = tg.initDataUnsafe?.start_param;
      if (sp) {
        const parts = sp.split('-');
        if (parts.length >= 2) { lang = parts[0]; type = parts[1]; }
      }

      setRedirectUrl(`${WEBAPP_URL}/anketa?lang=${lang}&type=${type}&tg_user=${encoded}`);
      setStatus('ready');

      // Focus button for quick tap
      setTimeout(() => buttonRef.current?.focus(), 100);
    } catch {
      setStatus('error');
      setMessage('Произошла ошибка');
    }
  }, []);

  const handleOpen = useCallback(() => {
    if (!redirectUrl) return;
    const tg = window.Telegram?.WebApp;
    try {
      if (tg?.openLink) {
        tg.openLink(redirectUrl, { try_instant_view: false });
      } else {
        window.open(redirectUrl, '_blank');
      }
      setTimeout(() => { tg?.close(); }, 1500);
    } catch {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  useEffect(() => {
    if (scriptLoaded) {
      const t = setTimeout(handleAuth, 300);
      return () => clearTimeout(t);
    }
  }, [scriptLoaded, handleAuth]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => { setStatus('error'); setMessage('Не удалось загрузить.'); }}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800">Авторизация...</h1>
            </>
          )}

          {status === 'ready' && (
            <>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать!</h1>
              <p className="text-lg text-gray-600 mb-6">{userName}</p>
              <button
                ref={buttonRef}
                onClick={handleOpen}
                className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-2xl text-white font-bold transition-colors text-xl flex items-center justify-center gap-3 shadow-lg"
              >
                <span>Перейти к анкете</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Ошибка</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button onClick={() => { setStatus('loading'); setTimeout(handleAuth, 300); }}
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
