'use client';

import { useState, useEffect, useMemo } from 'react';
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

export default function AnketaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const type = (searchParams.get('type') as QuestionnaireType) || 'infant';
  const sections = useMemo(() => getQuestionnaire(type), [type]);
  const title = getQuestionnaireTitle(type, language);

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
      setFormData(saved.formData);
      setAdditionalData(saved.additionalData);
      setContactData(saved.contactData);
    }
  }, [type, language]);

  // Auto-save form data
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveFormData(type, language, formData, additionalData, contactData);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData, additionalData, contactData, type, language]);

  const handleFieldChange = (questionId: string, value: string | string[] | File[]) => {
    // Check if value is File array (for file uploads)
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      setUploadedFiles((prev) => ({ ...prev, [questionId]: value as File[] }));
      // Store file names in formData for display purposes
      const fileNames = (value as File[]).map(f => f.name).join(', ');
      setFormData((prev) => ({ ...prev, [questionId]: fileNames }));
    } else {
      setFormData((prev) => ({ ...prev, [questionId]: value as string | string[] }));
    }
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
    // If operations changed to "no", clear additional field error
    if (questionId === 'operations' && value === 'no') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['operations_additional'];
        return newErrors;
      });
    }
    // If pregnancy_problems changed to "no", clear additional field error (for infant/child)
    if (questionId === 'pregnancy_problems' && value === 'no') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['pregnancy_problems_additional'];
        return newErrors;
      });
    }
    // If injuries changed to only "no_issues" or empty, clear additional field error (for infant/child)
    if (questionId === 'injuries' && typeof value !== 'object') {
      const injuriesArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOtherThanNoIssues = injuriesArray.some((val) => val !== 'no_issues');
      if (!hasOtherThanNoIssues) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['injuries_additional'];
          return newErrors;
        });
      }
    }
    // If serious_injuries changed to "no", clear additional field error (for adult)
    if (questionId === 'serious_injuries' && value === 'no') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['serious_injuries_additional'];
        return newErrors;
      });
    }
    // If allergies_present changed and "other" is not selected, clear additional field error
    if (questionId === 'allergies_present' && !(Array.isArray(value) && value[0] instanceof File)) {
      const allergiesArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = allergiesArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['allergies_present_additional'];
          return newErrors;
        });
      }
    }
    // If allergies changed and "other" is not selected, clear additional field error (for backward compatibility)
    if (questionId === 'allergies' && !(Array.isArray(value) && value[0] instanceof File)) {
      const allergiesArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = allergiesArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['allergies_additional'];
          return newErrors;
        });
      }
    }
    // If skin_problems changed and "other" is not selected, clear additional field error
    if (questionId === 'skin_problems' && !(Array.isArray(value) && value[0] instanceof File)) {
      const skinProblemsArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = skinProblemsArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['skin_problems_additional'];
          return newErrors;
        });
      }
    }
    // If skin_condition changed and "other" is not selected, clear additional field error (for backward compatibility)
    if (questionId === 'skin_condition' && !(Array.isArray(value) && value[0] instanceof File)) {
      const skinConditionArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = skinConditionArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['skin_condition_additional'];
          return newErrors;
        });
      }
    }
    // If chronic_autoimmune changed and "other" is not selected, clear additional field error
    if (questionId === 'chronic_autoimmune' && !(Array.isArray(value) && value[0] instanceof File)) {
      const chronicArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = chronicArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['chronic_autoimmune_additional'];
          return newErrors;
        });
      }
    }
    // If covid_complications changed and "other" is not selected, clear additional field error
    if (questionId === 'covid_complications' && !(Array.isArray(value) && value[0] instanceof File)) {
      const covidArray = Array.isArray(value) ? value as string[] : [value as string];
      const hasOther = covidArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['covid_complications_additional'];
          return newErrors;
        });
      }
    }
    // If has_tests_or_ultrasound changed to "no", clear attach_files (files and formData)
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
    // If how_learned changed and "recommendation" is not selected, clear additional field and error
    if (questionId === 'how_learned') {
      if (value !== 'recommendation') {
        setAdditionalData((prev) => {
          const newData = { ...prev };
          delete newData['how_learned_additional'];
          return newData;
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['how_learned_additional'];
          return newErrors;
        });
      }
    }
  };

  const handleAdditionalChange = (questionId: string, value: string) => {
    setAdditionalData((prev) => ({ ...prev, [`${questionId}_additional`]: value }));
    // Clear error when user starts typing in additional field
    const additionalKey = `${questionId}_additional`;
    if (errors[additionalKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[additionalKey];
        return newErrors;
      });
    }
  };

  const handleClearForm = () => {
    setFormData({});
    setAdditionalData({});
    setContactData({ telegram: '', instagram: '', phone: '' });
    setUploadedFiles({});
    setDsgvoAccepted(false);
    setErrors({});
    clearFormData(type, language);
    toast.success(language === 'ru' ? 'Форма очищена' : 'Form cleared');
  };

  const markdown = useMemo(() => {
    return generateMarkdown(type, sections, formData, additionalData, contactData, language);
  }, [type, sections, formData, additionalData, contactData, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(sections, formData, contactData, language, additionalData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(t('required'));
      // Скролл к первому полю с ошибкой после обновления DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const firstErrorField = document.querySelector('[data-error="true"]');
          firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const contactInfo = contactData.telegramUser 
          ? `@${contactData.telegramUser.username || contactData.telegramUser.id}`
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
  };

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
                              data-error={!!errors[question.id]}
                            >
                              <QuestionField
                                question={question}
                                value={formData[question.id] || ''}
                                additionalValue={additionalData[`${question.id}_additional`] || ''}
                                error={errors[question.id]}
                                additionalError={errors[`${question.id}_additional`]}
                                onChange={(value) => handleFieldChange(question.id, value)}
                                onAdditionalChange={(value) =>
                                  handleAdditionalChange(question.id, value)
                                }
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
                        return (
                          <div
                            key={question.id}
                            data-error={!!errors[question.id]}
                          >
                            <QuestionField
                              question={question}
                              value={
                                question.type === 'file'
                                  ? (uploadedFiles[question.id] || [])
                                  : formData[question.id] || (question.type === 'checkbox' ? [] : '')
                              }
                              additionalValue={additionalData[`${question.id}_additional`] || ''}
                              error={errors[question.id]}
                              additionalError={errors[`${question.id}_additional`]}
                              onChange={(value) => handleFieldChange(question.id, value)}
                              onAdditionalChange={(value) =>
                                handleAdditionalChange(question.id, value)
                              }
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
              telegramUser={contactData.telegramUser}
              errors={{
                telegram: errors['contact_telegram'],
                instagram: errors['contact_instagram'],
                phone: errors['contact_phone'],
                contact_method: errors['contact_method'],
              }}
              onTelegramAuth={(user) => {
                setContactData((prev) => ({ ...prev, telegramUser: user }));
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors['contact_method'];
                  delete newErrors['contact_telegram'];
                  return newErrors;
                });
              }}
              onInstagramChange={(value) => {
                setContactData((prev) => ({ ...prev, instagram: value }));
              }}
              onPhoneChange={(value) => {
                setContactData((prev) => ({ ...prev, phone: value }));
              }}
            />
          </div>

          {/* DSGVO Checkbox */}
          <DSGVOCheckbox checked={dsgvoAccepted} onChange={setDsgvoAccepted} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
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
          <MarkdownPreview markdown={markdown} onClose={() => setShowPreview(false)} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
