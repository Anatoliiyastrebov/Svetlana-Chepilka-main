'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { TelegramUserData } from '@/lib/form-utils';

// Re-export for convenience
export type TelegramUser = TelegramUserData;

interface TelegramLoginButtonProps {
  botUsername: string;
  onAuth: (user: TelegramUser) => void;
  telegramUser?: TelegramUser | null;
  error?: string;
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botUsername,
  onAuth,
  telegramUser,
  error,
}) => {
  const { language } = useLanguage();
  const [isOpened, setIsOpened] = useState(false);
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState('');

  // Open Telegram app with bot
  const openTelegramBot = () => {
    // Deep link to open Telegram app with the bot
    const deepLink = `tg://resolve?domain=${botUsername}&start=auth`;
    const webLink = `https://t.me/${botUsername}?start=auth`;
    
    // Try to open via link
    window.open(webLink, '_blank');
    
    // Also try deep link for mobile
    const link = document.createElement('a');
    link.href = deepLink;
    link.click();
    
    setIsOpened(true);
  };

  // Handle authorization confirmation
  const handleConfirmAuth = () => {
    let cleanUsername = username.trim();
    
    // Remove @ if present
    if (cleanUsername.startsWith('@')) {
      cleanUsername = cleanUsername.substring(1);
    }
    
    // Validate username
    if (!cleanUsername) {
      setInputError(language === 'ru' 
        ? 'Введите ваш Telegram username' 
        : 'Enter your Telegram username');
      return;
    }
    
    // Basic validation
    if (cleanUsername.length < 5) {
      setInputError(language === 'ru' 
        ? 'Username должен содержать минимум 5 символов' 
        : 'Username must be at least 5 characters');
      return;
    }
    
    // Create user data
    const userData: TelegramUser = {
      id: 0,
      first_name: cleanUsername,
      username: cleanUsername,
      auth_date: Math.floor(Date.now() / 1000),
      hash: '',
    };
    
    onAuth(userData);
    setInputError('');
  };

  // Get profile link
  const getProfileLink = (): string => {
    if (telegramUser?.username) {
      return `https://t.me/${telegramUser.username}`;
    }
    return '';
  };

  // If already authorized
  if (telegramUser) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Telegram</span>
        </div>
        
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">
                {language === 'ru' ? 'Авторизован через Telegram' : 'Authorized via Telegram'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                @{telegramUser.username}
              </p>
            </div>
          </div>
        </div>
        
        <a
          href={getProfileLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          {language === 'ru' ? 'Открыть профиль' : 'Open profile'}
        </a>
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

      {!isOpened ? (
        // Step 1: Open Telegram button
        <button
          type="button"
          onClick={openTelegramBot}
          className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          {language === 'ru' ? 'Авторизоваться через Telegram' : 'Authorize via Telegram'}
        </button>
      ) : (
        // Step 2: After opening Telegram - simple username input
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {language === 'ru'
                ? 'Нажмите "Начать" в боте, затем введите ваш username:'
                : 'Click "Start" in the bot, then enter your username:'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setInputError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmAuth();
                  }
                }}
                placeholder="username"
                className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleConfirmAuth}
              className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
            >
              {language === 'ru' ? 'Готово' : 'Done'}
            </button>
          </div>
          
          {inputError && (
            <p className="text-sm text-destructive">{inputError}</p>
          )}
          
          <button
            type="button"
            onClick={openTelegramBot}
            className="w-full text-sm text-primary hover:underline"
          >
            {language === 'ru' ? 'Открыть Telegram снова' : 'Open Telegram again'}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
