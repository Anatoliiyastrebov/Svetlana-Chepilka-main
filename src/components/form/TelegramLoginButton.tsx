'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, User } from 'lucide-react';
import { TelegramUserData } from '@/lib/form-utils';

// Re-export for convenience
export type TelegramUser = TelegramUserData;

interface TelegramLoginButtonProps {
  botUsername: string;
  onAuth: (user: TelegramUser) => void;
  telegramUser?: TelegramUser | null;
  error?: string;
}

// Declare the global callback function
declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botUsername,
  onAuth,
  telegramUser,
  error,
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up the global callback
    window.onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    // Clean up
    return () => {
      delete window.onTelegramAuth;
    };
  }, [onAuth]);

  useEffect(() => {
    if (!containerRef.current || telegramUser) return;

    // Clear container
    containerRef.current.innerHTML = '';

    // Create Telegram Login Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    containerRef.current.appendChild(script);
  }, [botUsername, telegramUser]);

  // Get profile link
  const getProfileLink = (user: TelegramUser): string => {
    if (user.username) {
      return `https://t.me/${user.username}`;
    }
    return `tg://user?id=${user.id}`;
  };

  if (telegramUser) {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {telegramUser.photo_url ? (
                <img
                  src={telegramUser.photo_url}
                  alt={telegramUser.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  {language === 'ru' ? 'Авторизован' : 'Authorized'}
                </span>
              </div>
              <p className="text-foreground font-medium">
                {telegramUser.first_name} {telegramUser.last_name || ''}
              </p>
              {telegramUser.username && (
                <p className="text-sm text-muted-foreground">@{telegramUser.username}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-accent/50 rounded-xl p-3">
          <p className="text-sm text-muted-foreground mb-1">
            {language === 'ru' ? 'Ссылка на профиль' : 'Profile link'}
          </p>
          <a
            href={getProfileLink(telegramUser)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline break-all"
          >
            {getProfileLink(telegramUser)}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {language === 'ru' ? 'Авторизуйтесь через Telegram' : 'Log in with Telegram'}
        </span>
        <span className="text-destructive">*</span>
      </div>
      
      <div ref={containerRef} className="flex justify-center py-2" />
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircleIcon />
          {error}
        </p>
      )}
      
      <p className="text-xs text-muted-foreground">
        {language === 'ru'
          ? 'Нажмите кнопку выше, чтобы войти через Telegram. Это позволит нам связаться с вами.'
          : 'Click the button above to log in via Telegram. This will allow us to contact you.'}
      </p>
    </div>
  );
};

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
