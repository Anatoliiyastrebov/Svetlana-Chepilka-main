'use client';

import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,32}$/;
const DEBOUNCE_MS = 600;

interface TelegramUsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TelegramUsernameField: React.FC<TelegramUsernameFieldProps> = memo(({
  value,
  onChange,
  error,
}) => {
  const { language } = useLanguage();
  const [localValue, setLocalValue] = useState(value);
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'valid' | 'invalid' | 'warning'>('idle');
  const [verifyMessage, setVerifyMessage] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const verifyUsername = useCallback(async (username: string) => {
    if (!USERNAME_REGEX.test(username)) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setVerifying(true);
    setVerifyStatus('idle');
    setVerifyMessage('');

    try {
      const res = await fetch(`/api/telegram/verify-username?username=${encodeURIComponent(username)}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      if (controller.signal.aborted) return;

      if (data.exists) {
        setVerifyStatus('valid');
        setVerifyMessage(language === 'ru' ? 'Пользователь найден' : 'User found');
      } else if (data.warning) {
        setVerifyStatus('warning');
        setVerifyMessage(language === 'ru' ? 'Убедитесь, что username указан верно' : 'Make sure the username is correct');
      } else {
        setVerifyStatus('warning');
        setVerifyMessage(language === 'ru' ? 'Убедитесь, что username указан верно' : 'Make sure the username is correct');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setVerifyStatus('warning');
      setVerifyMessage(language === 'ru' ? 'Не удалось проверить username' : 'Could not verify username');
    } finally {
      if (!controller.signal.aborted) {
        setVerifying(false);
      }
    }
  }, [language]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/^@+/, '').trim();
    raw = raw.replace(/[^a-zA-Z0-9_]/g, '');
    if (raw.length > 32) raw = raw.slice(0, 32);

    setLocalValue(raw);
    onChange(raw);
    setVerifyStatus('idle');
    setVerifyMessage('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (raw.length >= 5 && USERNAME_REGEX.test(raw)) {
      debounceRef.current = setTimeout(() => verifyUsername(raw), DEBOUNCE_MS);
    }
  }, [onChange, verifyUsername]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const formatError = error || (
    localValue.length > 0 && localValue.length < 5
      ? (language === 'ru' ? 'Минимум 5 символов' : 'Minimum 5 characters')
      : localValue.length > 0 && !USERNAME_REGEX.test(localValue)
        ? (language === 'ru' ? 'Только латиница, цифры и _' : 'Only latin letters, digits and _')
        : undefined
  );

  const profileLink = localValue.length >= 5 ? `https://t.me/${localValue}` : '';

  return (
    <>
      <input
        type="text"
        className={`input-field ${formatError ? 'input-error' : verifyStatus === 'valid' ? 'border-green-500 focus:ring-green-500' : ''}`}
        value={localValue ? `@${localValue}` : ''}
        onChange={handleChange}
        placeholder={language === 'ru' ? 'Введите без @ или с @' : 'Enter without @ or with @'}
        autoComplete="off"
        spellCheck={false}
      />

      {verifying && (
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
          {language === 'ru' ? 'Проверяем...' : 'Verifying...'}
        </p>
      )}

      {formatError && (
        <p className="error-message mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {formatError}
        </p>
      )}

      {verifyMessage && !formatError && !verifying && (
        <p className={`text-sm flex items-center gap-1 mt-1 ${
          verifyStatus === 'valid' ? 'text-green-600 dark:text-green-400' :
          verifyStatus === 'invalid' ? 'text-destructive' :
          'text-yellow-600 dark:text-yellow-400'
        }`}>
          {verifyStatus === 'valid' && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {verifyStatus === 'invalid' && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {verifyStatus === 'warning' && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {verifyMessage}
        </p>
      )}

      {profileLink && !formatError && (
        <div className="bg-accent/50 rounded-xl p-3 mt-2">
          <p className="text-sm text-muted-foreground mb-1">
            {language === 'ru' ? 'Ссылка на профиль:' : 'Profile link:'}
          </p>
          <a
            href={profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium flex items-center gap-1 hover:underline break-all"
          >
            {profileLink}
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      )}
    </>
  );
});

TelegramUsernameField.displayName = 'TelegramUsernameField';
