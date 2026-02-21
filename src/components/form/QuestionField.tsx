'use client';

import React, { useCallback, useMemo, useRef, memo } from 'react';
import { Question } from '@/lib/questionnaire-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionIcon } from '@/components/icons/SectionIcons';

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | File[];
  additionalValue: string;
  error?: string;
  additionalError?: string;
  onChange: (value: string | string[] | File[]) => void;
  onAdditionalChange: (value: string) => void;
}

export const QuestionField: React.FC<QuestionFieldProps> = memo(({
  question,
  value,
  additionalValue,
  error,
  additionalError,
  onChange,
  onAdditionalChange,
}) => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = useCallback((optionValue: string, checked: boolean) => {
    const currentValues = (Array.isArray(value) ? value : []) as string[];
    
    // Special handling for "no_issues" option
    if (optionValue === 'no_issues') {
    if (checked) {
        // If "no_issues" is selected, clear all other options
        onChange(['no_issues']);
      } else {
        // If "no_issues" is deselected, just remove it
        onChange([]);
      }
    } else {
      // For other options
      if (checked) {
        // Remove "no_issues" if it exists, then add the new option
        const filteredValues = currentValues.filter((v) => v !== 'no_issues');
        onChange([...filteredValues, optionValue]);
    } else {
      onChange(currentValues.filter((v) => v !== optionValue));
      }
    }
  }, [value, onChange]);

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`input-field ${error ? 'input-error' : ''}`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder?.[language] || ''}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={`input-field ${error ? 'input-error' : ''}`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            min="0"
            step="0.1"
            placeholder={question.placeholder?.[language] || ''}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={`input-field min-h-[100px] resize-y ${error ? 'input-error' : ''}`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder?.[language] || ''}
          />
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                  value === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label[language]}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxValues = (Array.isArray(value) ? value : []) as string[];
        return (
          <div className="flex flex-wrap gap-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                  checkboxValues.includes(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label[language]}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        const files = Array.isArray(value) && value.length > 0 && value[0] instanceof File 
          ? (value as File[]) 
          : [];
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
        const MAX_FILES = 10;
        return (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.heic"
              className="hidden"
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                const currentFiles = files;
                
                // Check max files
                if (currentFiles.length + selectedFiles.length > MAX_FILES) {
                  alert(language === 'ru' 
                    ? `Максимум ${MAX_FILES} файлов` 
                    : `Maximum ${MAX_FILES} files`);
                  return;
                }
                
                // Check file sizes
                const oversized = selectedFiles.filter(f => f.size > MAX_FILE_SIZE);
                if (oversized.length > 0) {
                  alert(language === 'ru' 
                    ? `Файл "${oversized[0].name}" превышает 50 МБ` 
                    : `File "${oversized[0].name}" exceeds 50 MB`);
                  return;
                }
                
                onChange([...currentFiles, ...selectedFiles]);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${error ? 'border-destructive' : ''}`}
            >
              {t('selectFiles')}
            </button>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t('selectedFiles')} ({files.length}/{MAX_FILES})
                </p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm bg-secondary p-2 rounded">
                    <span className="text-foreground truncate">{file.name}</span>
                    <span className="text-muted-foreground flex-shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(1)} МБ)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = files.filter((_, i) => i !== index);
                        onChange(newFiles);
                      }}
                      className="ml-auto text-destructive hover:text-destructive/80 flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {language === 'ru' 
                ? 'PDF, JPG, PNG, DOC, DOCX, XLS, XLSX — макс. 50 МБ'
                : 'PDF, JPG, PNG, DOC, DOCX, XLS, XLSX — max 50 MB'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <label className="flex items-center gap-2 text-foreground font-medium">
        <SectionIcon name={question.icon} />
        <span>{question.label[language]}</span>
        {question.required && <span className="text-destructive">*</span>}
      </label>

      {renderInput()}

      {error && (
        <p className="error-message">
          <AlertCircleIcon />
          {error}
        </p>
      )}

      {question.hasAdditional && (() => {
        // Special handling for how_learned - show only if recommendation or other is selected
        if (question.id === 'how_learned') {
          return value === 'recommendation' || value === 'other';
        }
        // Special handling for diabetes - show only if diabetes_stage is selected
        if (question.id === 'diabetes') {
          const currentValues = (Array.isArray(value) ? value : []) as string[];
          return currentValues.includes('diabetes_stage');
        }
        // Special handling for yes/no questions - show additional when "yes" is selected
        const yesNoQuestions = ['pregnancy_problems'];
        if (yesNoQuestions.includes(question.id)) {
          return value === 'yes';
        }
        // For radio questions, show only if "other" is selected
        if (question.type === 'radio') {
          return value === 'other';
        }
        // For checkbox questions with detail-requiring options
        if (question.type === 'checkbox') {
          const currentValues = (Array.isArray(value) ? value : []) as string[];
          // operations_traumas_status: show when any detail-requiring option is selected
          if (question.id === 'operations_traumas_status') {
            return currentValues.some(v => ['had_operations', 'organs_removed', 'had_injuries', 'other'].includes(v));
          }
          // gallbladder_kidneys_status: show when stones or other is selected
          if (question.id === 'gallbladder_kidneys_status') {
            return currentValues.some(v => ['gallbladder_stones', 'kidney_stones', 'other'].includes(v));
          }
          // joints_spine_problems: show when arthrosis, hernia or other is selected
          if (question.id === 'joints_spine_problems') {
            return currentValues.some(v => ['arthrosis', 'other'].includes(v));
          }
          return currentValues.includes('other');
        }
        // For other types (text, number, textarea), don't show additional
        return false;
      })() && (
        <div className="mt-2">
          <label className="text-sm text-muted-foreground mb-1 block">
            {question.id === 'how_learned' && value === 'recommendation'
              ? (language === 'ru' ? 'Укажите имя и фамилию' : 'Specify first and last name')
              : question.id === 'diabetes'
              ? (language === 'ru' ? 'Укажите стадию' : 'Specify stage')
              : question.id === 'operations_traumas_status'
              ? (language === 'ru' ? 'Опишите подробнее' : 'Describe in detail')
              : question.id === 'gallbladder_kidneys_status'
              ? (language === 'ru' ? 'Дополнительная информация' : 'Additional information')
              : question.id === 'joints_spine_problems'
              ? (language === 'ru' ? 'Уточните подробности' : 'Specify details')
              : t('additionalInfo')}
            {additionalError && <span className="text-destructive ml-1">*</span>}
          </label>
          <textarea
            className={`input-field text-sm min-h-[60px] resize-y ${additionalError ? 'input-error' : ''}`}
            value={additionalValue}
            onChange={(e) => onAdditionalChange(e.target.value)}
            placeholder={
              question.id === 'how_learned' && value === 'recommendation'
                ? (language === 'ru' ? 'Имя и фамилия' : 'First and last name')
                : question.id === 'diabetes'
                ? (language === 'ru' ? 'Укажите стадию' : 'Specify stage')
                : question.id === 'operations_traumas_status'
                ? (language === 'ru' ? 'Какие операции, удалённые органы, травмы' : 'Which operations, removed organs, injuries')
                : question.id === 'gallbladder_kidneys_status'
                ? (language === 'ru' ? 'Опишите подробнее (размер, диагноз и т.д.)' : 'Describe in detail (size, diagnosis, etc.)')
                : question.id === 'joints_spine_problems'
                ? (language === 'ru' ? 'Стадия артроза, локализация и т.д.' : 'Arthrosis stage, location, etc.')
                : t('additionalInfo')
            }
          />
          {additionalError && (
            <p className="error-message mt-1">
              <AlertCircleIcon />
              {additionalError}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

QuestionField.displayName = 'QuestionField';

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
