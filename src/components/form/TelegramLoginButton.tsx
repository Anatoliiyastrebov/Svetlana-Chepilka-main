'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, ExternalLink, Loader2, LogIn, LogOut } from 'lucide-react';
import { TelegramUserData } from '@/lib/form-utils';

// Re-export for convenience
export type TelegramUser = TelegramUserData;

// Environment variables
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SvetlanaChepilkaBot';
const MINI_APP_NAME = process.env.NEXT_PUBLIC_TELEGRAM_MINI_APP_NAME || 'Authorization';

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

  // Handle tg_user from URL (after Telegram redirect) - no server session needed
  const handleTgUser = useCallback((encodedUser: string) => {
    if (telegramUser) return; // Already authorized
    
    setIsLoading(true);
    try {
      // Decode user data from URL
      const decodedData = JSON.parse(decodeURIComponent(atob(encodedUser)));
      
      // Convert to TelegramUser format
      const userData: TelegramUser = {
        id: decodedData.id,
        first_name: decodedData.first_name,
        last_name: decodedData.last_name,
        username: decodedData.username,
        auth_date: Math.floor(Date.now() / 1000),
        hash: '',
      };
      
      onAuth(userData);
      
      // Save to localStorage for persistence
      localStorage.setItem('telegram_user', JSON.stringify(userData));
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('tg_user');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Error decoding user data:', error);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [telegramUser, onAuth]);

  // Check for tg_user in URL on mount (new flow - no server session)
  useEffect(() => {
    const tgUser = searchParams.get('tg_user');
    if (tgUser && !telegramUser && !authChecked) {
      handleTgUser(tgUser);
    } else {
      setAuthChecked(true);
    }
  }, [searchParams, telegramUser, authChecked, handleTgUser]);

  // Check localStorage for saved user on mount
  useEffect(() => {
    if (!telegramUser && authChecked) {
      const savedUser = localStorage.getItem('telegram_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          onAuth(user);
        } catch (e) {
          localStorage.removeItem('telegram_user');
        }
      }
    }
  }, [telegramUser, authChecked, onAuth]);

  // Handle Telegram login button click
  const handleTelegramLogin = () => {
    setIsLoading(true);
    
    // Save current URL to return after auth
    localStorage.setItem('telegram_auth_return_url', window.location.href);
    
    // Redirect directly to Telegram Mini App (no server session needed)
    const telegramUrl = `https://t.me/${BOT_USERNAME}/${MINI_APP_NAME}`;
    window.location.href = telegramUrl;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_auth_return_url');
    if (onLogout) {
      onLogout();
    }
  };

  // Get profile link
  const getProfileLink = (): string => {
    if (telegramUser?.username) {
      return `https://t.me/${telegramUser.username}`;
    }
    if (telegramUser?.id) {
      return `tg://user?id=${telegramUser.id}`;
    }
    return '';
  };

  // Get display name
  const getDisplayName = (): string => {
    if (!telegramUser) return '';
    if (telegramUser.username) return `@${telegramUser.username}`;
    if (telegramUser.last_name) return `${telegramUser.first_name} ${telegramUser.last_name}`;
    return telegramUser.first_name;
  };

  // If already authorized
  if (telegramUser) {
    const profileLink = getProfileLink();
    
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
            <div className="min-w-0">
              <p className="font-medium text-green-700 dark:text-green-300">
                {language === 'ru' ? 'Авторизован через Telegram' : 'Authorized via Telegram'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {getDisplayName()}
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
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

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
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
};
