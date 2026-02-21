'use client';

import React, { useState, memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck } from 'lucide-react';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';

interface DSGVOCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const DSGVOCheckbox: React.FC<DSGVOCheckboxProps> = memo(({ checked, onChange }) => {
  const { t, language } = useLanguage();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const privacyPolicyLink = {
    ru: 'Подробнее',
    en: 'Read more',
  };

  return (
    <>
      <div className="bg-accent/30 rounded-2xl p-5 border border-border">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-input bg-background peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
            {checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{language === 'ru' ? 'Согласие на обработку данных' : 'Consent to data processing'}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('dsgvoConsent')}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPrivacyPolicy(true);
              }}
              className="text-primary hover:underline text-sm mt-2 font-medium"
            >
              {privacyPolicyLink[language]}
            </button>
          </div>
        </label>
    </div>

      <PrivacyPolicyDialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
    </>
  );
});

DSGVOCheckbox.displayName = 'DSGVOCheckbox';
