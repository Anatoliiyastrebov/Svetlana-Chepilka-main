'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuestionField } from '@/components/form/QuestionField';
import { ContactSection } from '@/components/form/ContactSection';
import { DSGVOCheckbox } from '@/components/form/DSGVOCheckbox';
import { MarkdownPreview } from '@/components/form/MarkdownPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionIcon } from '@/components/icons/SectionIcons';
import {
  getQuestionnaire,
  getQuestionnaireTitle,
  QuestionnaireType,
} from '@/lib/questionnaire-data';
import {
  FormData,
  FormAdditionalData,
  ContactData,
  FormErrors,
  validateForm,
  generateMarkdown,
  saveFormData,
  loadFormData,
  clearFormData,
  sendToTelegram,
  saveSubmittedData,
} from '@/lib/form-utils';
import { Eye, Send, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Question } from '@/lib/questionnaire-data';

// Wrapper to provide stable callbacks per question for React.memo optimization
const QuestionFieldWrapper = memo(({
  question,
  value,
  additionalValue,
  error,
  additionalError,
  onFieldChange,
  onAdditionalChange,
}: {
  question: Question;
  value: string | string[] | File[];
  additionalValue: string;
  error?: string;
  additionalError?: string;
  onFieldChange: (questionId: string, value: string | string[] | File[]) => void;
  onAdditionalChange: (questionId: string, value: string) => void;
}) => {
  const handleChange = useCallback(
    (val: string | string[] | File[]) => onFieldChange(question.id, val),
    [question.id, onFieldChange]
  );
  const handleAdditional = useCallback(
    (val: string) => onAdditionalChange(question.id, val),
    [question.id, onAdditionalChange]
  );
  return (
    <QuestionField
      question={question}
      value={value}
      additionalValue={additionalValue}
      error={error}
      additionalError={additionalError}
      onChange={handleChange}
      onAdditionalChange={handleAdditional}
    />
  );
});
QuestionFieldWrapper.displayName = 'QuestionFieldWrapper';

export default function AnketaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const type = (searchParams.get('type') as QuestionnaireType) || 'infant';
  const sections = useMemo(() => getQuestionnaire(type), [type]);
  const title = useMemo(() => getQuestionnaireTitle(type, language), [type, language]);

  // Check if environment variables are configured
  const isEnvConfigured = useMemo(() => {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    return !!(BOT_TOKEN && CHAT_ID && BOT_TOKEN.trim() !== '' && CHAT_ID.trim() !== '');
  }, []);

  const [formData, setFormData] = useState<FormData>({});
  const [additionalData, setAdditionalData] = useState<FormAdditionalData>({});
  
  const [contactData, setContactData] = useState<ContactData>({
    telegram: '',
    instagram: '',
    phone: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  // Load saved form data on mount
  useEffect(() => {
    const saved = loadFormData(type, language);
    if (saved) {
      const cleanFormData = { ...saved.formData };
      delete cleanFormData['attach_files'];
      
      setFormData(cleanFormData);
      setAdditionalData(saved.additionalData);
      setContactData(saved.contactData);
    }
  }, [type, language]);

  // Auto-save form data (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveFormData(type, language, formData, additionalData, contactData);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData, additionalData, contactData, type, language]);

  const handleFieldChange = useCallback((questionId: string, value: string | string[] | File[]) => {
    // Check if value is File array (for file uploads)
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      setUploadedFiles((prev) => ({ ...prev, [questionId]: value as File[] }));
      const fileNames = (value as File[]).map(f => f.name).join(', ');
      setFormData((prev) => ({ ...prev, [questionId]: fileNames }));
    } else {
      setFormData((prev) => ({ ...prev, [questionId]: value as string | string[] }));
    }

    // Clear error when user interacts with a field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];

      // Clear related additional field errors based on question logic
      const isFileArray = Array.isArray(value) && value.length > 0 && value[0] instanceof File;
      const valArray = !isFileArray && Array.isArray(value) ? value as string[] : typeof value === 'string' ? [value] : [];

      // Simple "no" clears _additional
      if (['pregnancy_problems'].includes(questionId) && value === 'no') {
        delete newErrors[`${questionId}_additional`];
      }
      // Injuries: clear if only "no_issues"
      if (questionId === 'injuries' && !isFileArray) {
        if (!valArray.some((v) => v !== 'no_issues')) {
          delete newErrors['injuries_additional'];
        }
      }
      // Checkbox fields with "other": clear additional if "other" not selected
      const otherCheckboxFields = ['allergies_present', 'allergies', 'skin_problems', 'skin_condition', 'chronic_autoimmune', 'covid_complications'];
      if (otherCheckboxFields.includes(questionId) && !isFileArray) {
        if (!valArray.includes('other')) {
          delete newErrors[`${questionId}_additional`];
        }
      }
      // how_learned: clear if not "recommendation"
      if (questionId === 'how_learned' && value !== 'recommendation') {
        delete newErrors['how_learned_additional'];
      }

      return newErrors;
    });

    // If covid_had changed to "no", clear covid_times and conditionally covid_complications
    if (questionId === 'covid_had' && value === 'no') {
      setFormData((prev) => {
        const next = { ...prev };
        delete next['covid_times'];
        // Only clear complications if vaccination is also not "yes"
        if (next['covid_vaccinated'] !== 'yes') {
          delete next['covid_complications'];
        }
        return next;
      });
      setAdditionalData((prev) => {
        const next = { ...prev };
        if (formData['covid_vaccinated'] !== 'yes') {
          delete next['covid_complications_additional'];
        }
        return next;
      });
    }
    // If covid_vaccinated changed to "no", clear covid_doses and conditionally covid_complications
    if (questionId === 'covid_vaccinated' && value === 'no') {
      setFormData((prev) => {
        const next = { ...prev };
        delete next['covid_doses'];
        // Only clear complications if covid_had is also not "yes"
        if (next['covid_had'] !== 'yes') {
          delete next['covid_complications'];
        }
        return next;
      });
      setAdditionalData((prev) => {
        const next = { ...prev };
        if (formData['covid_had'] !== 'yes') {
          delete next['covid_complications_additional'];
        }
        return next;
      });
    }
    // If has_tests_or_ultrasound changed to "no", clear attach_files
    if (questionId === 'has_tests_or_ultrasound' && value === 'no') {
      setUploadedFiles((prev) => {
        const next = { ...prev };
        delete next['attach_files'];
        return next;
      });
      setFormData((prev) => {
        const next = { ...prev };
        delete next['attach_files'];
        return next;
      });
    }
    // If how_learned changed and "recommendation" is not selected, clear additional data
    if (questionId === 'how_learned' && value !== 'recommendation') {
      setAdditionalData((prev) => {
        const newData = { ...prev };
        delete newData['how_learned_additional'];
        return newData;
      });
    }
  }, []);

  const handleAdditionalChange = useCallback((questionId: string, value: string) => {
    setAdditionalData((prev) => ({ ...prev, [`${questionId}_additional`]: value }));
    const additionalKey = `${questionId}_additional`;
    setErrors((prev) => {
      if (!prev[additionalKey]) return prev;
      const newErrors = { ...prev };
      delete newErrors[additionalKey];
      return newErrors;
    });
  }, []);

  const handleClearForm = useCallback(() => {
    setFormData({});
    setAdditionalData({});
    setContactData({ telegram: '', instagram: '', phone: '' });
    setUploadedFiles({});
    setDsgvoAccepted(false);
    setErrors({});
    clearFormData(type, language);
    toast.success(language === 'ru' ? 'Форма очищена' : 'Form cleared');
  }, [type, language]);

  const markdown = useMemo(() => {
    return generateMarkdown(type, sections, formData, additionalData, contactData, language);
  }, [type, sections, formData, additionalData, contactData, language]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(sections, formData, contactData, language, additionalData, uploadedFiles);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(language === 'ru' ? 'Заполните все обязательные поля' : 'Please fill in all required fields');
      // Скролл к первому полю с ошибкой после обновления DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const firstErrorField = document.querySelector('[data-error="true"]');
          if (firstErrorField) {
            const elementRect = firstErrorField.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const offset = 100; // Отступ сверху для видимости
            window.scrollTo({
              top: absoluteElementTop - offset,
              behavior: 'smooth'
            });
          }
        });
      });
      return;
    }

    if (!dsgvoAccepted) {
      toast.error(language === 'ru' ? 'Необходимо принять условия' : 'You must accept the terms');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get files for attach_files question
      const filesToSend = uploadedFiles['attach_files'] || [];
      const result = await sendToTelegram(markdown, filesToSend, language);
      
      if (result.success) {
        // Save submitted data with message_id
        const name = `${formData.name || ''} ${formData.last_name || ''}`.trim() || 'Anonymous';
        const contactInfo = contactData.telegram 
          ? `@${contactData.telegram}`
          : contactData.instagram || contactData.phone || 'No contact';
        
        const identifier = result.messageId || Date.now();
        
        saveSubmittedData({
          messageId: identifier,
          timestamp: Date.now(),
          name,
          contactInfo,
          type,
        });
        
        clearFormData(type, language);
        router.push(`/success?lang=${language}`);
      } else {
        const errorMsg = result.error || t('submitError');
        console.error('Failed to send form:', errorMsg);
        toast.error(errorMsg, {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMsg = error?.message || t('submitError');
      toast.error(errorMsg, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [sections, formData, contactData, language, additionalData, uploadedFiles, dsgvoAccepted, markdown, type, t, router]);

  // Memoized callbacks for ContactSection
  const handleTelegramChange = useCallback((value: string) => {
    setContactData((prev) => ({ ...prev, telegram: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors['contact_method'];
      delete newErrors['contact_telegram'];
      return newErrors;
    });
  }, []);

  const handleInstagramChange = useCallback((value: string) => {
    setContactData((prev) => ({ ...prev, instagram: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors['contact_method'];
      delete newErrors['contact_instagram'];
      return newErrors;
    });
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setContactData((prev) => ({ ...prev, phone: value }));
  }, []);

  const handleTogglePreview = useCallback(() => setShowPreview(true), []);
  const handleClosePreview = useCallback(() => setShowPreview(false), []);

  // Memoized contact errors object for ContactSection
  const contactErrors = useMemo(() => ({
    telegram: errors['contact_telegram'],
    instagram: errors['contact_instagram'],
    phone: errors['contact_phone'],
    contact_method: errors['contact_method'],
  }), [errors]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8 animate-fade-in">
          {title}
        </h1>

        {!isEnvConfigured && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {language === 'ru' 
                ? 'Переменные окружения не настроены' 
                : 'Environment variables not configured'}
            </AlertTitle>
            <AlertDescription>
              {language === 'ru' 
                ? 'Telegram Bot Token или Chat ID не настроены. Пожалуйста, настройте переменные окружения NEXT_PUBLIC_TELEGRAM_BOT_TOKEN и NEXT_PUBLIC_TELEGRAM_CHAT_ID.'
                : 'Telegram Bot Token or Chat ID not configured. Please set NEXT_PUBLIC_TELEGRAM_BOT_TOKEN and NEXT_PUBLIC_TELEGRAM_CHAT_ID environment variables.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="card-wellness space-y-6"
              style={{ animationDelay: `${sectionIndex * 0.1}s` }}
            >
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <SectionIcon name={section.icon} className="w-6 h-6 text-primary" />
                {section.title[language]}
              </h2>

              <div className="space-y-6">
                {(() => {
                  const compactFieldIds = ['name', 'last_name', 'age', 'height', 'weight'];
                  const compactQuestions = section.questions.filter(
                    (q) => compactFieldIds.includes(q.id) && (q.type === 'text' || q.type === 'number')
                  );
                  const otherQuestions = section.questions.filter(
                    (q) => !compactFieldIds.includes(q.id) || (q.type !== 'text' && q.type !== 'number')
                  );

                  return (
                    <>
                      {compactQuestions.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {compactQuestions.map((question) => (
                            <div
                              key={question.id}
                              data-error={!!errors[question.id] || !!errors[`${question.id}_additional`]}
                            >
                              <QuestionFieldWrapper
                                question={question}
                                value={formData[question.id] || ''}
                                additionalValue={additionalData[`${question.id}_additional`] || ''}
                                error={errors[question.id]}
                                additionalError={errors[`${question.id}_additional`]}
                                onFieldChange={handleFieldChange}
                                onAdditionalChange={handleAdditionalChange}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {otherQuestions.map((question) => {
                        if (question.id === 'attach_files' && formData['has_tests_or_ultrasound'] !== 'yes') {
                          return null;
                        }
                        if (question.id === 'weight_change' && formData['weight_satisfaction'] !== 'no') {
                          return null;
                        }
                        if (question.id === 'pressure_medication' && formData['pressure'] !== 'high') {
                          return null;
                        }
                        if (question.id === 'covid_times' && formData['covid_had'] !== 'yes') {
                          return null;
                        }
                        if (question.id === 'covid_doses' && formData['covid_vaccinated'] !== 'yes') {
                          return null;
                        }
                        if (question.id === 'covid_complications' && formData['covid_had'] !== 'yes' && formData['covid_vaccinated'] !== 'yes') {
                          return null;
                        }
                        return (
                          <div
                            key={question.id}
                            data-error={!!errors[question.id] || !!errors[`${question.id}_additional`]}
                          >
                            <QuestionFieldWrapper
                              question={question}
                              value={
                                question.type === 'file'
                                  ? (uploadedFiles[question.id] || [])
                                  : formData[question.id] || (question.type === 'checkbox' ? [] : '')
                              }
                              additionalValue={additionalData[`${question.id}_additional`] || ''}
                              error={errors[question.id]}
                              additionalError={errors[`${question.id}_additional`]}
                              onFieldChange={handleFieldChange}
                              onAdditionalChange={handleAdditionalChange}
                            />
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div
            data-error={
              !!(
                errors['contact_telegram'] ||
                errors['contact_instagram'] ||
                errors['contact_phone'] ||
                errors['contact_method']
              )
            }
          >
            <ContactSection
              contactData={contactData}
              errors={contactErrors}
              onTelegramChange={handleTelegramChange}
              onInstagramChange={handleInstagramChange}
              onPhoneChange={handlePhoneChange}
            />
          </div>

          {/* DSGVO Checkbox */}
          <DSGVOCheckbox checked={dsgvoAccepted} onChange={setDsgvoAccepted} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleTogglePreview}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Eye className="w-5 h-5" />
              {t('previewMarkdown')}
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              {t('clearForm')}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!dsgvoAccepted || isSubmitting || !isEnvConfigured}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('submit')}
              </>
            )}
          </button>
        </form>

        {/* Markdown Preview Modal */}
        {showPreview && (
          <MarkdownPreview markdown={markdown} onClose={handleClosePreview} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
