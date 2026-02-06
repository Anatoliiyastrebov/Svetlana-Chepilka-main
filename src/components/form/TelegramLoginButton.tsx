'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, ExternalLink, Loader2, LogIn, LogOut } from 'lucide-react';
import { TelegramUserData } from '@/lib/form-utils';

// Re-export for convenience
export type TelegramUser = TelegramUserData;

// Environment variables
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SvetlanaChepilkaBot';
const MINI_APP_NAME = process.env.NEXT_PUBLIC_TELEGRAM_MINI_APP_NAME || 'Authorization';

// Safe Base64 encoding/decoding for Unicode strings
const safeEncode = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  } catch {
    return '';
  }
};

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

// Safe localStorage wrapper
const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};

// Validate user data structure
const isValidUserData = (data: unknown): data is TelegramUser => {
  if (!data || typeof data !== 'object') return false;
  const user = data as Record<string, unknown>;
  return (
    typeof user.id === 'number' &&
    typeof user.first_name === 'string' &&
    user.first_name.length > 0
  );
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

  // Handle tg_user from URL (after Telegram redirect)
  const handleTgUser = useCallback((encodedUser: string) => {
    if (telegramUser) return;
    
    setIsLoading(true);
    try {
      const decoded = safeDecode(encodedUser);
      if (!decoded) {
        throw new Error('Failed to decode user data');
      }
      
      const decodedData = JSON.parse(decoded);
      
      // Validate decoded data
      if (!isValidUserData(decodedData)) {
        throw new Error('Invalid user data structure');
      }
      
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
      
      // Clean up URL without triggering navigation
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('tg_user');
        window.history.replaceState(null, '', url.toString());
      }
    } catch (error) {
      console.error('Error decoding user data:', error);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [telegramUser, onAuth]);

  // Check for tg_user in URL on mount
  useEffect(() => {
    const tgUser = searchParams.get('tg_user');
    if (tgUser && !telegramUser && !authChecked) {
      handleTgUser(tgUser);
    } else if (!authChecked) {
      setAuthChecked(true);
    }
  }, [searchParams, telegramUser, authChecked, handleTgUser]);

  // Check localStorage for saved user on mount (only once)
  useEffect(() => {
    if (!telegramUser && authChecked) {
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
  }, [telegramUser, authChecked, onAuth]);

  // Handle Telegram login button click
  const handleTelegramLogin = useCallback(() => {
    setIsLoading(true);
    
    try {
      const returnUrl = safeEncode(window.location.href);
      if (!returnUrl) {
        console.error('Failed to encode return URL');
        setIsLoading(false);
        return;
      }
      
      const telegramUrl = `https://t.me/${BOT_USERNAME}/${MINI_APP_NAME}?startapp=${returnUrl}`;
      window.location.href = telegramUrl;
    } catch (error) {
      console.error('Error during login redirect:', error);
      setIsLoading(false);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    safeStorage.remove('telegram_user');
    onLogout?.();
  }, [onLogout]);

  // Memoized profile link
  const profileLink = useMemo((): string => {
    if (telegramUser?.username) {
      return `https://t.me/${telegramUser.username}`;
    }
    if (telegramUser?.id && telegramUser.id !== 0) {
      return `tg://user?id=${telegramUser.id}`;
    }
    return '';
  }, [telegramUser]);

  // Memoized display name
  const displayName = useMemo((): string => {
    if (!telegramUser) return '';
    if (telegramUser.username) return `@${telegramUser.username}`;
    const fullName = [telegramUser.first_name, telegramUser.last_name]
      .filter(Boolean)
      .join(' ');
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
            ? (language === 'ru' ? 'Загрузка...' : 'Loading...')
            : (language === 'ru' ? 'Войти через Telegram' : 'Login with Telegram')}
        </span>
      </button>

      <p className="text-xs text-muted-foreground text-center">
        {language === 'ru'
          ? 'Нажмите кнопку, чтобы авторизоваться через Telegram'
          : 'Click the button to authorize via Telegram'}
      </p>

      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
