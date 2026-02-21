'use client';

import React, { memo, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Instagram, Phone, ExternalLink } from 'lucide-react';
import { TelegramUsernameField } from './TelegramUsernameField';

interface ContactSectionProps {
  contactData: {
    telegram?: string;
    instagram?: string;
    phone?: string;
  };
  errors?: {
    telegram?: string;
    instagram?: string;
    phone?: string;
    contact_method?: string;
  };
  onTelegramChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = memo(({
  contactData,
  errors = {},
  onTelegramChange,
  onInstagramChange,
  onPhoneChange,
}) => {
  const { t, language } = useLanguage();

  const cleanInstagram = useMemo(() => (contactData.instagram || '').replace(/^@/, '').trim(), [contactData.instagram]);
  const instagramLink = useMemo(() => cleanInstagram ? `https://instagram.com/${cleanInstagram}` : '', [cleanInstagram]);

  return (
    <div className="card-wellness space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        {t('contactMethod')}
      </h3>

      <p className="text-sm text-muted-foreground">
        {language === 'ru'
          ? 'Укажите хотя бы один способ связи: Telegram или Instagram'
          : 'Please provide at least one contact method: Telegram or Instagram'}
      </p>

      {errors.contact_method && (
        <p className="error-message">
          <AlertCircleIcon />
          {errors.contact_method}
        </p>
      )}

      {/* Telegram username */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Telegram
        </label>
        <TelegramUsernameField
          value={contactData.telegram || ''}
          onChange={onTelegramChange}
          error={errors.telegram}
        />
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
          <span className="text-xs text-muted-foreground font-normal">
            ({language === 'ru' ? 'необязательно' : 'optional'})
          </span>
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
});

ContactSection.displayName = 'ContactSection';

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
