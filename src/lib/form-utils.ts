import { QuestionnaireSection, QuestionnaireType, Question } from './questionnaire-data';
import { Language, translations } from './translations';

// Helper function for Russian number declension
const getRussianDeclension = (num: number, forms: [string, string, string]): string => {
  const absNum = Math.abs(num);
  const lastTwo = absNum % 100;
  const lastOne = absNum % 10;
  
  if (lastTwo >= 11 && lastTwo <= 19) {
    return forms[2]; // 11-19: литров, миллилитров, килограммов
  }
  if (lastOne === 1) {
    return forms[0]; // 1, 21, 31...: литр, миллилитр, килограмм
  }
  if (lastOne >= 2 && lastOne <= 4) {
    return forms[1]; // 2-4, 22-24...: литра, миллилитра, килограмма
  }
  return forms[2]; // 0, 5-20, 25-30...: литров, миллилитров, килограммов
};

// Format value with unit
const formatValueWithUnit = (value: string, unit: Question['unit'], lang: Language): string => {
  if (!unit || !value) return value;
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;
  
  if (lang === 'ru') {
    switch (unit) {
      case 'ml':
        return `${value} ${getRussianDeclension(numValue, ['миллилитр', 'миллилитра', 'миллилитров'])}`;
      case 'liters':
        return `${value} ${getRussianDeclension(numValue, ['литр', 'литра', 'литров'])}`;
      case 'kg':
        return `${value} ${getRussianDeclension(numValue, ['килограмм', 'килограмма', 'килограммов'])}`;
      case 'cm':
        return `${value} см`;
      case 'years':
        return `${value} ${getRussianDeclension(numValue, ['год', 'года', 'лет'])}`;
      case 'months':
        return `${value} ${getRussianDeclension(numValue, ['месяц', 'месяца', 'месяцев'])}`;
      default:
        return value;
    }
  } else {
    // English
    switch (unit) {
      case 'ml':
        return `${value} ml`;
      case 'liters':
        return `${value} ${numValue === 1 ? 'liter' : 'liters'}`;
      case 'kg':
        return `${value} kg`;
      case 'cm':
        return `${value} cm`;
      case 'years':
        return `${value} ${numValue === 1 ? 'year' : 'years'}`;
      case 'months':
        return `${value} ${numValue === 1 ? 'month' : 'months'}`;
      default:
        return value;
    }
  }
};

export interface FormData {
  [key: string]: string | string[];
}

export interface FormAdditionalData {
  [key: string]: string;
}

export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface ContactData {
  telegram?: string;
  telegramUser?: TelegramUserData;
  instagram?: string;
  phone?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SubmittedData {
  messageId: number;
  timestamp: number;
  name: string;
  contactInfo: string;
  type: QuestionnaireType;
}

// Storage keys
const getStorageKey = (type: QuestionnaireType, lang: Language) => 
  `health_questionnaire_${type}_${lang}`;

const getSubmittedDataKey = () => 'health_questionnaire_submitted';

// Save form data to localStorage
export const saveFormData = (
  type: QuestionnaireType,
  lang: Language,
  formData: FormData,
  additionalData: FormAdditionalData,
  contactData: ContactData
) => {
  try {
    const data = { formData, additionalData, contactData, timestamp: Date.now() };
    localStorage.setItem(getStorageKey(type, lang), JSON.stringify(data));
  } catch (err) {
    console.error('Error saving form data:', err);
  }
};

// Load form data from localStorage
export const loadFormData = (type: QuestionnaireType, lang: Language) => {
  try {
    const stored = localStorage.getItem(getStorageKey(type, lang));
    if (stored) {
      const data = JSON.parse(stored);
      // Only return if data is less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return {
          formData: data.formData as FormData,
          additionalData: data.additionalData as FormAdditionalData,
          contactData: data.contactData as ContactData,
        };
      }
    }
  } catch (err) {
    console.error('Error loading form data:', err);
  }
  return null;
};

// Clear form data from localStorage
export const clearFormData = (type: QuestionnaireType, lang: Language) => {
  try {
    localStorage.removeItem(getStorageKey(type, lang));
  } catch (err) {
    console.error('Error clearing form data:', err);
  }
};

// Save submitted data with message_id for deletion requests
export const saveSubmittedData = (data: SubmittedData) => {
  try {
    const existing = getSubmittedDataList();
    existing.push(data);
    localStorage.setItem(getSubmittedDataKey(), JSON.stringify(existing));
  } catch (err) {
    console.error('Error saving submitted data:', err);
  }
};

// Get list of submitted data
export const getSubmittedDataList = (): SubmittedData[] => {
  try {
    const stored = localStorage.getItem(getSubmittedDataKey());
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error loading submitted data:', err);
    return [];
  }
};

// Delete submitted data by message_id
export const deleteSubmittedData = (messageId: number) => {
  try {
    const existing = getSubmittedDataList();
    const filtered = existing.filter(item => item.messageId !== messageId);
    localStorage.setItem(getSubmittedDataKey(), JSON.stringify(filtered));
  } catch (err) {
    console.error('Error deleting submitted data:', err);
  }
};

// Delete message from Telegram
export const deleteTelegramMessage = async (messageId: number): Promise<{ success: boolean; error?: string }> => {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return { success: false, error: 'Telegram Bot Token or Chat ID not configured' };
  }

  // Check if messageId is a real Telegram message_id (usually small numbers) or a timestamp fallback
  // Telegram message_ids are typically small integers, timestamps are large numbers (milliseconds since epoch)
  // If messageId is larger than a reasonable message_id (e.g., > 1 billion), it's likely a timestamp
  if (messageId > 1000000000) {
    return { 
      success: false, 
      error: 'Cannot delete: message ID not available. Please contact us directly to delete your data.' 
    };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          message_id: messageId,
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok || !responseData.ok) {
      const errorMsg = responseData.description || 'Failed to delete message';
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    };
  }
};

// Validate form
export const validateForm = (
  sections: QuestionnaireSection[],
  formData: FormData,
  contactData: ContactData,
  lang: Language,
  additionalData?: FormAdditionalData
): FormErrors => {
  const errors: FormErrors = {};
  const t = translations[lang];

  sections.forEach((section) => {
    section.questions.forEach((question) => {
      // Skip conditionally hidden fields
      if (question.id === 'pressure_medication' && formData['pressure'] !== 'high') {
        return;
      }
      if (question.id === 'weight_change' && formData['weight_satisfaction'] !== 'no') {
        return;
      }
      if (question.id === 'attach_files' && formData['has_tests_or_ultrasound'] !== 'yes') {
        return;
      }

      if (question.required) {
        const value = formData[question.id];
        
        if (question.type === 'checkbox') {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors[question.id] = t.selectAtLeastOne;
          }
        } else if (question.type === 'number') {
          if (!value || value === '' || isNaN(Number(value))) {
            errors[question.id] = t.required;
          }
        } else {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors[question.id] = t.required;
          }
        }
      }

      // Generic validation: if "other" is selected in any question with hasAdditional, the additional field is required
      if (question.hasAdditional && additionalData && (question.type === 'radio' || question.type === 'checkbox')) {
        const value = formData[question.id];
        const valueArray = Array.isArray(value) ? value : [value];
        const hasOther = valueArray.includes('other');
        
        if (hasOther) {
          const additionalValue = additionalData[`${question.id}_additional`];
          if (!additionalValue || additionalValue.trim() === '') {
            errors[`${question.id}_additional`] = t.required;
          }
        }
      }
    });
  });

  // Special validation: if operations is "yes", additional field is required
  if (formData['operations'] === 'yes' && additionalData) {
    const operationsAdditional = additionalData['operations_additional'];
    if (!operationsAdditional || operationsAdditional.trim() === '') {
      errors['operations_additional'] = t.required;
    }
  }

  // Special validation: if pregnancy_problems is "yes", additional field is required (for infant/child questionnaires)
  if (formData['pregnancy_problems'] === 'yes' && additionalData) {
    const pregnancyProblemsAdditional = additionalData['pregnancy_problems_additional'];
    if (!pregnancyProblemsAdditional || pregnancyProblemsAdditional.trim() === '') {
      errors['pregnancy_problems_additional'] = t.required;
    }
  }

  // Special validation: if injuries has any option selected except "no_issues", additional field is required (for infant/child questionnaires)
  if (formData['injuries'] && additionalData) {
    const injuriesValue = formData['injuries'];
    const injuriesArray = Array.isArray(injuriesValue) ? injuriesValue : [injuriesValue];
    // Check if any option other than "no_issues" is selected
    const hasOtherThanNoIssues = injuriesArray.some((val: string) => val !== 'no_issues');
    if (hasOtherThanNoIssues) {
      const injuriesAdditional = additionalData['injuries_additional'];
      if (!injuriesAdditional || injuriesAdditional.trim() === '') {
        errors['injuries_additional'] = t.required;
      }
    }
  }

  // Special validation: if serious_injuries is "yes", additional field is required (for adult questionnaires)
  if (formData['serious_injuries'] === 'yes' && additionalData) {
    const seriousInjuriesAdditional = additionalData['serious_injuries_additional'];
    if (!seriousInjuriesAdditional || seriousInjuriesAdditional.trim() === '') {
      errors['serious_injuries_additional'] = t.required;
    }
  }

  // Special validation: if allergies_present has "other" selected, additional field is required
  if (formData['allergies_present'] && additionalData) {
    const allergiesValue = formData['allergies_present'];
    const allergiesArray = Array.isArray(allergiesValue) ? allergiesValue : [allergiesValue];
    const hasOther = allergiesArray.includes('other');
    if (hasOther) {
      const allergiesAdditional = additionalData['allergies_present_additional'];
      if (!allergiesAdditional || allergiesAdditional.trim() === '') {
        errors['allergies_present_additional'] = t.required;
      }
    }
  }

  // Special validation: if allergies has "other" selected (for backward compatibility with child/infant)
  if (formData['allergies'] && additionalData) {
    const allergiesValue = formData['allergies'];
    const allergiesArray = Array.isArray(allergiesValue) ? allergiesValue : [allergiesValue];
    const hasOther = allergiesArray.includes('other');
    if (hasOther) {
      const allergiesAdditional = additionalData['allergies_additional'];
      if (!allergiesAdditional || allergiesAdditional.trim() === '') {
        errors['allergies_additional'] = t.required;
      }
    }
  }

  // Special validation: if skin_problems has "other" selected, additional field is required
  if (formData['skin_problems'] && additionalData) {
    const skinProblemsValue = formData['skin_problems'];
    const skinProblemsArray = Array.isArray(skinProblemsValue) ? skinProblemsValue : [skinProblemsValue];
    const hasOther = skinProblemsArray.includes('other');
    if (hasOther) {
      const skinProblemsAdditional = additionalData['skin_problems_additional'];
      if (!skinProblemsAdditional || skinProblemsAdditional.trim() === '') {
        errors['skin_problems_additional'] = t.required;
      }
    }
  }

  // Special validation: if skin_condition has "other" selected (for backward compatibility)
  if (formData['skin_condition'] && additionalData) {
    const skinConditionValue = formData['skin_condition'];
    const skinConditionArray = Array.isArray(skinConditionValue) ? skinConditionValue : [skinConditionValue];
    const hasOther = skinConditionArray.includes('other');
    if (hasOther) {
      const skinConditionAdditional = additionalData['skin_condition_additional'];
      if (!skinConditionAdditional || skinConditionAdditional.trim() === '') {
        errors['skin_condition_additional'] = t.required;
      }
    }
  }

  // Special validation: if chronic_autoimmune has "other" selected, additional field is required
  if (formData['chronic_autoimmune'] && additionalData) {
    const chronicValue = formData['chronic_autoimmune'];
    const chronicArray = Array.isArray(chronicValue) ? chronicValue : [chronicValue];
    const hasOther = chronicArray.includes('other');
    if (hasOther) {
      const chronicAdditional = additionalData['chronic_autoimmune_additional'];
      if (!chronicAdditional || chronicAdditional.trim() === '') {
        errors['chronic_autoimmune_additional'] = t.required;
      }
    }
  }

  // Special validation: if covid_complications has "other" selected, additional field is required
  if (formData['covid_complications'] && additionalData) {
    const covidValue = formData['covid_complications'];
    const covidArray = Array.isArray(covidValue) ? covidValue : [covidValue];
    const hasOther = covidArray.includes('other');
    if (hasOther) {
      const covidAdditional = additionalData['covid_complications_additional'];
      if (!covidAdditional || covidAdditional.trim() === '') {
        errors['covid_complications_additional'] = t.required;
      }
    }
  }

  // Special validation: if how_learned is "recommendation", additional field is required
  if (formData['how_learned'] === 'recommendation' && additionalData) {
    const howLearnedAdditional = additionalData['how_learned_additional'];
    if (!howLearnedAdditional || howLearnedAdditional.trim() === '') {
      errors['how_learned_additional'] = t.required;
    }
  }

  // Special validation: if diabetes has "diabetes_stage" selected (for backward compatibility)
  if (formData['diabetes'] && additionalData) {
    const diabetesValue = formData['diabetes'];
    const diabetesArray = Array.isArray(diabetesValue) ? diabetesValue : [diabetesValue];
    const hasDiabetesStage = diabetesArray.includes('diabetes_stage');
    if (hasDiabetesStage) {
      const diabetesAdditional = additionalData['diabetes_additional'];
      if (!diabetesAdditional || diabetesAdditional.trim() === '') {
        errors['diabetes_additional'] = t.required;
      }
    }
  }

  // Validate contact - Telegram login is required
  const hasTelegramUser = !!contactData.telegramUser;
  
  if (!hasTelegramUser) {
    errors['contact_method'] = lang === 'ru' 
      ? 'Необходимо авторизоваться через Telegram' 
      : 'You must log in via Telegram';
  }

  return errors;
};

// Generate Markdown
export const generateMarkdown = (
  type: QuestionnaireType,
  sections: QuestionnaireSection[],
  formData: FormData,
  additionalData: FormAdditionalData,
  contactData: ContactData,
  lang: Language
): string => {
  const t = translations[lang];
  const headers = {
    infant: t.mdInfant,
    child: t.mdChild,
    woman: t.mdWoman,
    man: t.mdMan,
  };

  // Escape special characters for HTML (Telegram supports HTML parse mode)
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Start with header
  let html = `<b>${escapeHtml(headers[type])}</b>\n`;

  let questionNumber = 1;
  let digestionQuestionPassed = false;

  sections.forEach((section) => {
    // Skip empty sections
    const hasAnswers = section.questions.some((question) => {
      const value = formData[question.id];
      return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
    });

    if (!hasAnswers) return;

    // For numbered sections: put number before section title
    // Check if this section starts after digestion
    const sectionHasDigestion = section.questions.some(
      (q) => q.id === 'digestion' || q.id === 'digestion_problems'
    );
    if (sectionHasDigestion) {
      digestionQuestionPassed = true;
      questionNumber = 1;
    }

    // Determine if this section has only one question with generic/matching label
    const answeredQuestions = section.questions.filter((q) => {
      if (q.id === 'attach_files' && formData['has_tests_or_ultrasound'] !== 'yes') return false;
      const v = formData[q.id];
      return v && (Array.isArray(v) ? v.length > 0 : (typeof v === 'string' && v.trim() !== ''));
    });
    const genericLabels = ['Отметьте подходящее', 'Select applicable', 'Mark applicable'];
    const sectionTitle = (section.title[lang] || '').replace(/\s+/g, ' ').trim();
    const isSingleGenericQuestion = answeredQuestions.length === 1 && 
      (genericLabels.includes((answeredQuestions[0].label[lang] || '').trim()) || 
       (answeredQuestions[0].label[lang] || '').trim() === sectionTitle);

    // Section header with number if applicable
    if (digestionQuestionPassed && isSingleGenericQuestion) {
      // Single generic question: "8. Section Title\n Answer"
      html += `${questionNumber}. <b>${escapeHtml(section.title[lang])}</b>\n`;
      questionNumber++;
      
      const q = answeredQuestions[0];
      const value = formData[q.id];
      const additional = additionalData[`${q.id}_additional`];
      let answerText = '';
      if (Array.isArray(value)) {
        answerText = value.map((v) => {
          const opt = q.options?.find((o) => o.value === v);
          return opt ? opt.label[lang] : v;
        }).join(', ');
      } else if (q.options) {
        const opt = q.options.find((o) => o.value === value);
        answerText = opt ? opt.label[lang] : String(value);
      } else {
        answerText = q.unit ? formatValueWithUnit(String(value), q.unit, lang) : String(value);
      }
      html += `${escapeHtml(answerText)}`;
      if (additional && additional.trim() !== '') {
        html += ` <i>(${escapeHtml(additional.trim())})</i>`;
      }
      html += `\n`;
    } else {
      // Regular section with multiple questions
      html += `<b>${escapeHtml(section.title[lang])}</b>\n`;

      section.questions.forEach((question) => {
        if (question.id === 'attach_files' && formData['has_tests_or_ultrasound'] !== 'yes') {
          return;
        }
        const value = formData[question.id];
        const additional = additionalData[`${question.id}_additional`];

        if (value && (Array.isArray(value) ? value.length > 0 : (typeof value === 'string' && value.trim() !== ''))) {
          const label = question.label[lang];
          
          // Format answer
          let answerText = '';
          if (question.type === 'file') {
            answerText = String(value);
          } else if (Array.isArray(value)) {
            const optionLabels = value.map((v) => {
              const opt = question.options?.find((o) => o.value === v);
              return opt ? opt.label[lang] : v;
            });
            answerText = optionLabels.join(', ');
          } else if (question.options) {
            const opt = question.options.find((o) => o.value === value);
            answerText = opt ? opt.label[lang] : value;
          } else {
            answerText = question.unit 
              ? formatValueWithUnit(String(value), question.unit, lang)
              : String(value);
          }

          // Check if label should be skipped
          const questionLabel = (label || '').replace(/\s+/g, ' ').trim();
          const skipLabel = questionLabel === sectionTitle || genericLabels.includes(questionLabel);
          
          if (skipLabel) {
            if (digestionQuestionPassed) {
              html += `${questionNumber}. `;
              questionNumber++;
            }
            html += `${escapeHtml(answerText)}`;
          } else {
            if (digestionQuestionPassed) {
              html += `${questionNumber}. <b>${escapeHtml(label)}</b>\n`;
              questionNumber++;
            } else {
              html += `<b>${escapeHtml(label)}</b>\n`;
            }
            html += `${escapeHtml(answerText)}`;
          }
          
          if (additional && additional.trim() !== '') {
            html += ` <i>(${escapeHtml(additional.trim())})</i>`;
          }
          
          html += `\n`;
        }
      });
    }
  });

  // Contact section
  const contacts: string[] = [];
  
  // Telegram user (from Telegram authorization)
  if (contactData.telegramUser) {
    const user = contactData.telegramUser;
    const profileLink = user.username 
      ? `https://t.me/${user.username}` 
      : `tg://user?id=${user.id}`;
    const openProfileLabel = lang === 'ru' ? 'Открыть профиль' : 'Open profile';
    
    // Build contact info
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    let telegramInfo = '';
    if (user.username) {
      telegramInfo = `Telegram: @${escapeHtml(user.username)}`;
    } else {
      telegramInfo = `Telegram: ${escapeHtml(fullName || 'User')}`;
    }
    if (user.id && user.id !== 0) {
      telegramInfo += `\nID: ${user.id}`;
    }
    telegramInfo += `\n\n<a href="${profileLink}">👤 ${openProfileLabel}</a>`;
    
    contacts.push(telegramInfo);
  } else if (contactData.telegram && contactData.telegram.trim() !== '') {
    // Fallback to manual input
    const cleanTelegram = contactData.telegram.replace(/^@/, '').trim();
    const telegramLink = `https://t.me/${cleanTelegram}`;
    contacts.push(`Telegram: @${escapeHtml(cleanTelegram)}\n<a href="${telegramLink}">${escapeHtml(telegramLink)}</a>`);
  }
  
  if (contactData.instagram && contactData.instagram.trim() !== '') {
    const cleanInstagram = contactData.instagram.replace(/^@/, '').trim();
    const instagramLink = `https://instagram.com/${cleanInstagram}`;
    contacts.push(`Instagram: @${escapeHtml(cleanInstagram)}\n<a href="${instagramLink}">${escapeHtml(instagramLink)}</a>`);
  }
  
  if (contactData.phone && contactData.phone.trim() !== '') {
    const cleanPhone = contactData.phone.trim();
    const phoneLink = `tel:${cleanPhone}`;
    const phoneLabel = lang === 'ru' ? 'Телефон' : 'Phone';
    contacts.push(`${phoneLabel}: <a href="${phoneLink}">${escapeHtml(cleanPhone)}</a>`);
  }

  if (contacts.length > 0) {
    html += `<b>${escapeHtml(t.mdContacts)}</b>\n`;
    contacts.forEach((contact) => {
      html += `${contact}\n`;
    });
  }

  // Убираем подряд идущие одинаковые строки: сравниваем по тексту без HTML и без ведущего «1. »
  const normalizeForCompare = (s: string) =>
    s.replace(/<[^>]*>/g, '').replace(/^\s*\d+\.\s*/, '').trim();
  const lines = html.split('\n');
  const deduped: string[] = [];
  let prevNormalized = '';
  for (const line of lines) {
    const normalized = normalizeForCompare(line);
    if (normalized !== prevNormalized) {
      deduped.push(line);
      prevNormalized = normalized;
    }
  }
  return deduped.join('\n');
};

// Check if file is an image (for Telegram: send as photo so it's viewable inline)
const isImageFile = (file: File): boolean => {
  const type = (file.type || '').toLowerCase();
  if (type.startsWith('image/')) return true;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
};

// Send file to Telegram (images via sendPhoto for inline viewing, rest via sendDocument)
const sendFileToTelegram = async (
  botToken: string,
  chatId: string,
  file: File,
  caption?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    const isImage = isImageFile(file);
    if (isImage) {
      formData.append('photo', file, file.name);
    } else {
      formData.append('document', file, file.name);
    }
    if (caption) {
      formData.append('caption', caption);
    }

    const endpoint = isImage
      ? `https://api.telegram.org/bot${botToken}/sendPhoto`
      : `https://api.telegram.org/bot${botToken}/sendDocument`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.ok) {
      const errorMsg = responseData.description || 'Failed to send file';
      console.error('Telegram file upload error:', errorMsg);
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending file to Telegram:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    };
  }
};

// Send to Telegram
// SECURITY NOTE: In production, use environment variables or a server-side proxy
// Do not expose BOT_TOKEN in client-side code in production!
// For development: Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env file
export const sendToTelegram = async (
  markdown: string,
  files: File[] = [],
  lang: Language = 'ru'
): Promise<{ success: boolean; error?: string; messageId?: number }> => {
  // Get from environment variables
  const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  // Debug: Log environment variables status
  console.log('Environment check:', {
    hasToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID,
    tokenLength: BOT_TOKEN?.length || 0,
    chatIdLength: CHAT_ID?.length || 0,
    nodeEnv: process.env.NODE_ENV
  });

  // Validate that tokens are set
  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.trim() === '' || CHAT_ID.trim() === '') {
    const errorMsg = `Telegram Bot Token or Chat ID not configured. 
    
Please check:
1. Go to Vercel → Project settings → Environment variables
2. Make sure these variables are set:
   - Key: NEXT_PUBLIC_TELEGRAM_BOT_TOKEN, Value: your_bot_token
   - Key: NEXT_PUBLIC_TELEGRAM_CHAT_ID, Value: your_chat_id
3. After adding variables, redeploy your site
4. Wait for the build to complete

Current status:
- NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: ${BOT_TOKEN ? 'SET' : 'NOT SET'}
- NEXT_PUBLIC_TELEGRAM_CHAT_ID: ${CHAT_ID ? 'SET' : 'NOT SET'}`;
    
    console.error('Environment variables check failed:', {
      BOT_TOKEN: BOT_TOKEN ? 'SET (hidden)' : 'NOT SET',
      CHAT_ID: CHAT_ID ? 'SET (hidden)' : 'NOT SET'
    });
    return { success: false, error: errorMsg };
  }

  // Log payload for debugging
  console.log('Sending to Telegram...', { 
    chatId: CHAT_ID.substring(0, 4) + '...', 
    textLength: markdown.length,
    hasToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID
  });

  // Create AbortController for timeout
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: markdown,
          parse_mode: 'HTML',
        }),
        signal: controller.signal,
      }
    );

    if (timeoutId) clearTimeout(timeoutId);

    const responseData = await response.json();

    if (!response.ok) {
      const errorMsg = responseData.description || `HTTP ${response.status}`;
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      return { 
        success: false, 
        error: `Telegram API error: ${errorMsg}` 
      };
    }

    if (!responseData.ok) {
      const errorMsg = responseData.description || 'Unknown Telegram API error';
      console.error('Telegram API returned error:', responseData);
      return { 
        success: false, 
        error: `Telegram API error: ${errorMsg}` 
      };
    }

    const messageId = responseData.result?.message_id;
    console.log('Successfully sent message to Telegram', { 
      messageId,
      filesCount: files.length
    });

    // Send files if any
    if (files.length > 0) {
      console.log('Sending files to Telegram...', { count: files.length });
      const t = translations[lang];
      const filesCaption = lang === 'ru' 
        ? `${t.filesToQuestionnaire} (${files.length} ${files.length === 1 ? 'файл' : files.length < 5 ? 'файла' : 'файлов'})`
        : `${t.filesToQuestionnaire} (${files.length} ${files.length === 1 ? 'file' : 'files'})`;
      const fileResults = await Promise.allSettled(
        files.map((file, index) => 
          sendFileToTelegram(
            BOT_TOKEN,
            CHAT_ID,
            file,
            index === 0 ? filesCaption : undefined
          )
        )
      );

      const failedFiles = fileResults
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => result.status === 'rejected' || 
          (result.status === 'fulfilled' && !result.value.success));

      if (failedFiles.length > 0) {
        console.warn('Some files failed to upload:', failedFiles);
        // Don't fail the whole submission if files fail, but log it
      } else {
        console.log('All files sent successfully');
      }
    }

    return { 
      success: true, 
      messageId: messageId 
    };
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Please check your internet connection and try again.';
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Error sending to Telegram:', {
      error,
      message: errorMessage,
      name: error?.name,
      stack: error?.stack
    });
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
