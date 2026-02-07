'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, ExternalLink, Loader2, LogIn, LogOut } from 'lucide-react';
import { TelegramUserData } from '@/lib/form-utils';

export type TelegramUser = TelegramUserData;

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SvetlanaChepilkaBot';
const MINI_APP_NAME = process.env.NEXT_PUBLIC_TELEGRAM_MINI_APP_NAME || 'SvetlanaAuth';

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

// Validate user data
const isValidUserData = (data: unknown): data is TelegramUser => {
  if (!data || typeof data !== 'object') return false;
  const user = data as Record<string, unknown>;
  return typeof user.id === 'number' && typeof user.first_name === 'string' && user.first_name.length > 0;
};

interface TelegramLoginButtonProps {
  botUsername?: string;
  onAuth: (user: TelegramUser) => void;
  onLogout?: () => void;
  telegramUser?: TelegramUser | null;
  error?: string;
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  onAuth,
  onLogout,
  telegramUser,
  error,
}) => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for tg_user in URL (after redirect from Mini App)
  useEffect(() => {
    if (authChecked || telegramUser) return;
    
    const tgUser = searchParams.get('tg_user');
    if (tgUser) {
      try {
        const decoded = safeDecode(tgUser);
        if (!decoded) throw new Error('Failed to decode');
        
        const data = JSON.parse(decoded);
        if (!isValidUserData(data)) throw new Error('Invalid data');

        const userData: TelegramUser = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name || '',
          username: data.username || '',
          auth_date: data.auth_date || Math.floor(Date.now() / 1000),
          hash: '',
        };

        onAuth(userData);
        try { localStorage.setItem('telegram_user', JSON.stringify(userData)); } catch {}

        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('tg_user');
        window.history.replaceState(null, '', url.toString());
      } catch (e) {
        console.error('Error processing tg_user:', e);
      }
    }
    setAuthChecked(true);
  }, [searchParams, telegramUser, authChecked, onAuth]);

  // Check localStorage for saved user on mount
  useEffect(() => {
    if (!telegramUser && authChecked) {
      try {
        const saved = localStorage.getItem('telegram_user');
        if (saved) {
          const user = JSON.parse(saved);
          if (isValidUserData(user)) {
            onAuth(user);
          } else {
            localStorage.removeItem('telegram_user');
          }
        }
      } catch {
        localStorage.removeItem('telegram_user');
      }
    }
  }, [telegramUser, authChecked, onAuth]);

  // Open Telegram Mini App in new window
  const handleTelegramLogin = useCallback(() => {
    setIsLoading(true);

    try {
      // Pass current page params so Mini App knows where to redirect
      const url = new URL(window.location.href);
      const lang = url.searchParams.get('lang') || 'ru';
      const type = url.searchParams.get('type') || 'infant';
      
      // startapp only allows: a-z, A-Z, 0-9, _, -  (max 64 chars)
      // Format: lang-type-timestamp (e.g., "ru-adult-m4x7k2")
      const ts = Date.now().toString(36);
      const startapp = `${lang}-${type}-${ts}`;
      const telegramUrl = `https://t.me/${BOT_USERNAME}/${MINI_APP_NAME}?startapp=${startapp}`;
      
      // Open in new window — current page stays
      window.open(telegramUrl, '_blank');

      setTimeout(() => setIsLoading(false), 3000);
    } catch (error) {
      console.error('Error opening Telegram:', error);
      setIsLoading(false);
    }
  }, []);

  // Logout
  const handleLogout = useCallback(() => {
    try { localStorage.removeItem('telegram_user'); } catch {}
    onLogout?.();
  }, [onLogout]);

  // Profile link
  const profileLink = useMemo((): string => {
    if (telegramUser?.username) return `https://t.me/${telegramUser.username}`;
    if (telegramUser?.id && telegramUser.id !== 0) return `tg://user?id=${telegramUser.id}`;
    return '';
  }, [telegramUser]);

  // Display name
  const displayName = useMemo((): string => {
    if (!telegramUser) return '';
    if (telegramUser.username) return `@${telegramUser.username}`;
    return [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') || 'Telegram User';
  }, [telegramUser]);

  // === Authorized ===
  if (telegramUser) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Telegram</span>
          <span className="text-destructive">*</span>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-green-700 dark:text-green-300">
                {language === 'ru' ? 'Авторизован через Telegram' : 'Authorized via Telegram'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 truncate">{displayName}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {profileLink && (
            <a href={profileLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              {language === 'ru' ? 'Открыть профиль' : 'Open profile'}
            </a>
          )}
          <button type="button" onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            title={language === 'ru' ? 'Выйти' : 'Logout'}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // === Not authorized ===
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Telegram</span>
        <span className="text-destructive">*</span>
      </div>
      <button type="button" onClick={handleTelegramLogin} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
        <span>{language === 'ru' ? 'Войти через Telegram' : 'Login with Telegram'}</span>
      </button>
      <p className="text-xs text-muted-foreground text-center">
        {language === 'ru' ? 'Откроется Telegram для авторизации' : 'Telegram will open for authorization'}
      </p>
      {error && <p className="text-sm text-destructive text-center" role="alert">{error}</p>}
    </div>
  );
};
