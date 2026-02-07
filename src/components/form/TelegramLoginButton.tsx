'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Safe localStorage wrapper
const safeStorage = {
  get: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): boolean => {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
  remove: (key: string): void => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
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
  const [isLoading, setIsLoading] = useState(false);

  // Process encoded user data from auth callback
  const processAuthData = useCallback((encodedUser: string) => {
    try {
      const decoded = safeDecode(encodedUser);
      if (!decoded) return;

      const decodedData = JSON.parse(decoded);
      if (!isValidUserData(decodedData)) return;

      const userData: TelegramUser = {
        id: decodedData.id,
        first_name: decodedData.first_name,
        last_name: decodedData.last_name || '',
        username: decodedData.username || '',
        auth_date: decodedData.auth_date || Math.floor(Date.now() / 1000),
        hash: decodedData.hash || '',
      };

      onAuth(userData);
      safeStorage.set('telegram_user', JSON.stringify(userData));
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing auth data:', error);
      setIsLoading(false);
    }
  }, [onAuth]);

  // Listen for auth data from callback page (via localStorage 'storage' event)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'telegram_auth_data' && e.newValue && !telegramUser) {
        processAuthData(e.newValue);
        // Clean up
        safeStorage.remove('telegram_auth_data');
        safeStorage.remove('telegram_auth_timestamp');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [telegramUser, processAuthData]);

  // Also poll localStorage in case storage event doesn't fire (same tab)
  useEffect(() => {
    if (!isLoading || telegramUser) return;

    const interval = setInterval(() => {
      const authData = safeStorage.get('telegram_auth_data');
      if (authData) {
        processAuthData(authData);
        safeStorage.remove('telegram_auth_data');
        safeStorage.remove('telegram_auth_timestamp');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, telegramUser, processAuthData]);

  // Check localStorage for saved user on mount
  useEffect(() => {
    if (!telegramUser) {
      const savedUser = safeStorage.get('telegram_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (isValidUserData(user)) {
            onAuth(user);
          } else {
            safeStorage.remove('telegram_user');
          }
        } catch {
          safeStorage.remove('telegram_user');
        }
      }
    }
  }, [telegramUser, onAuth]);

  // Open Telegram in new window — current page stays open
  const handleTelegramLogin = useCallback(() => {
    setIsLoading(true);

    try {
      const telegramUrl = `https://t.me/${BOT_USERNAME}/${MINI_APP_NAME}`;
      
      // Open in new window/tab — current page stays intact
      window.open(telegramUrl, '_blank');

      // Stop loading after 60 seconds (timeout)
      setTimeout(() => setIsLoading(false), 60000);
    } catch (error) {
      console.error('Error opening Telegram:', error);
      setIsLoading(false);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    safeStorage.remove('telegram_user');
    safeStorage.remove('telegram_auth_data');
    onLogout?.();
  }, [onLogout]);

  // Memoized profile link
  const profileLink = useMemo((): string => {
    if (telegramUser?.username) return `https://t.me/${telegramUser.username}`;
    if (telegramUser?.id && telegramUser.id !== 0) return `tg://user?id=${telegramUser.id}`;
    return '';
  }, [telegramUser]);

  // Memoized display name
  const displayName = useMemo((): string => {
    if (!telegramUser) return '';
    if (telegramUser.username) return `@${telegramUser.username}`;
    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ');
    return fullName || 'Telegram User';
  }, [telegramUser]);

  // Authorized state
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
              <p className="text-sm text-green-600 dark:text-green-400 truncate">
                {displayName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {profileLink && (
            <a
              href={profileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'ru' ? 'Открыть профиль' : 'Open profile'}
            </a>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            title={language === 'ru' ? 'Выйти' : 'Logout'}
            aria-label={language === 'ru' ? 'Выйти' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Not authorized state
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Telegram</span>
        <span className="text-destructive">*</span>
      </div>

      <button
        type="button"
        onClick={handleTelegramLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        <span>
          {isLoading
            ? (language === 'ru' ? 'Ожидание авторизации...' : 'Waiting for authorization...')
            : (language === 'ru' ? 'Войти через Telegram' : 'Login with Telegram')}
        </span>
      </button>

      {isLoading && (
        <p className="text-xs text-muted-foreground text-center">
          {language === 'ru'
            ? 'Подтвердите авторизацию в Telegram и вернитесь сюда'
            : 'Confirm authorization in Telegram and come back here'}
        </p>
      )}

      {!isLoading && (
        <p className="text-xs text-muted-foreground text-center">
          {language === 'ru'
            ? 'Откроется Telegram для авторизации'
            : 'Telegram will open for authorization'}
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
