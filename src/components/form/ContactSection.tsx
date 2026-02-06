'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Instagram, Phone, ExternalLink } from 'lucide-react';
import { TelegramLoginButton, TelegramUser } from './TelegramLoginButton';

interface ContactSectionProps {
  contactData: {
    telegram?: string;
    instagram?: string;
    phone?: string;
  };
  telegramUser?: TelegramUser | null;
  errors?: {
    telegram?: string;
    instagram?: string;
    phone?: string;
    contact_method?: string;
  };
  onTelegramAuth: (user: TelegramUser) => void;
  onTelegramLogout?: () => void;
  onInstagramChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

// Get bot username from environment variable
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'your_bot_username';

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactData,
  telegramUser,
  errors = {},
  onTelegramAuth,
  onTelegramLogout,
  onInstagramChange,
  onPhoneChange,
}) => {
  const { t, language } = useLanguage();

  const cleanInstagram = (contactData.instagram || '').replace(/^@/, '').trim();
  const cleanPhone = (contactData.phone || '').trim();

  const instagramLink = cleanInstagram ? `https://instagram.com/${cleanInstagram}` : '';

  return (
    <div className="card-wellness space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        {t('contactMethod')}
      </h3>

      {errors.contact_method && (
        <p className="error-message">
          <AlertCircleIcon />
          {errors.contact_method}
        </p>
      )}

      {/* Telegram Login */}
      <div className="bg-accent/30 rounded-xl p-4 border border-border">
        <TelegramLoginButton
          botUsername={BOT_USERNAME}
          onAuth={onTelegramAuth}
          onLogout={onTelegramLogout}
          telegramUser={telegramUser}
          error={errors.telegram}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {language === 'ru' ? 'или дополнительно' : 'or additionally'}
          </span>
        </div>
      </div>

      {/* Instagram */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
          <Instagram className="w-4 h-4 text-primary" />
          {t('instagram')}
        </label>
        <input
          type="text"
          className={`input-field ${errors.instagram ? 'input-error' : ''}`}
          value={contactData.instagram || ''}
          onChange={(e) => onInstagramChange(e.target.value)}
          placeholder={t('usernameHint')}
        />
        {errors.instagram && (
          <p className="error-message mt-1">
            <AlertCircleIcon />
            {errors.instagram}
          </p>
        )}
        {cleanInstagram && (
          <div className="bg-accent/50 rounded-xl p-3 mt-2">
            <p className="text-sm text-muted-foreground mb-1">{t('contactLink')}</p>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium flex items-center gap-1 hover:underline break-all"
            >
              {instagramLink}
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          {t('phone')}
        </label>
        <input
          type="tel"
          className={`input-field ${errors.phone ? 'input-error' : ''}`}
          value={contactData.phone || ''}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t('phoneHint')}
        />
        {errors.phone && (
          <p className="error-message mt-1">
            <AlertCircleIcon />
            {errors.phone}
          </p>
        )}
      </div>
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
