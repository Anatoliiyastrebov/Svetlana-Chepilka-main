'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Generate auth token on mount
  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await fetch('/api/telegram/token');
        const data = await response.json();
        if (data.token) {
          setAuthToken(data.token);
        }
      } catch (error) {
        console.error('Failed to generate token:', error);
      }
    };
    
    if (!telegramUser) {
      generateToken();
    }
  }, [telegramUser]);

  // Check for authorization
  const checkAuth = useCallback(async () => {
    if (!authToken || telegramUser) return;
    
    try {
      const response = await fetch(`/api/telegram/check?token=${authToken}`);
      const data = await response.json();
      
      if (data.authorized && data.user) {
        onAuth(data.user);
        setIsWaiting(false);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
    }
  }, [authToken, telegramUser, onAuth]);

  // Poll for authorization status when waiting
  useEffect(() => {
    if (!isWaiting || !authToken || telegramUser) return;
    
    const interval = setInterval(() => {
      checkAuth();
      setCheckCount(prev => prev + 1);
    }, 2000); // Check every 2 seconds
    
    // Stop after 5 minutes (150 checks)
    if (checkCount > 150) {
      setIsWaiting(false);
      setCheckCount(0);
    }
    
    return () => clearInterval(interval);
  }, [isWaiting, authToken, telegramUser, checkAuth, checkCount]);

  // Open Telegram app with bot and auth token
  const openTelegramBot = () => {
    if (!authToken) return;
    
    // Deep link with auth token
    const webLink = `https://t.me/${botUsername}?start=${authToken}`;
    
    // Open in new tab
    window.open(webLink, '_blank');
    
    // Start waiting for authorization
    setIsWaiting(true);
    setCheckCount(0);
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

  // If already authorized
  if (telegramUser) {
    const profileLink = getProfileLink();
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Telegram</span>
        </div>
        
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-green-700 dark:text-green-300">
                {language === 'ru' ? 'Авторизован через Telegram' : 'Authorized via Telegram'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 truncate">
                {telegramUser.first_name} {telegramUser.last_name || ''}
                {telegramUser.username && ` (@${telegramUser.username})`}
              </p>
            </div>
          </div>
        </div>
        
        {profileLink && (
          <a
            href={profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {language === 'ru' ? 'Открыть профиль' : 'Open profile'}
          </a>
        )}
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

      {!isWaiting ? (
        // Initial state: Show button to open Telegram
        <button
          type="button"
          onClick={openTelegramBot}
          disabled={!authToken}
          className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          {language === 'ru' ? 'Авторизоваться через Telegram' : 'Authorize via Telegram'}
        </button>
      ) : (
        // Waiting state: Show waiting indicator
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  {language === 'ru' ? 'Ожидание авторизации...' : 'Waiting for authorization...'}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {language === 'ru' 
                    ? 'Нажмите "Начать" в боте Telegram' 
                    : 'Click "Start" in the Telegram bot'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openTelegramBot}
              className="flex-1 py-2.5 px-4 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium rounded-xl transition-colors text-sm"
            >
              {language === 'ru' ? 'Открыть снова' : 'Open again'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsWaiting(false);
                setCheckCount(0);
              }}
              className="flex-1 py-2.5 px-4 border border-border text-foreground hover:bg-muted rounded-xl transition-colors text-sm"
            >
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        {language === 'ru'
          ? 'Откроется Telegram. Нажмите "Начать" в боте для авторизации.'
          : 'Telegram will open. Click "Start" in the bot to authorize.'}
      </p>
    </div>
  );
};
