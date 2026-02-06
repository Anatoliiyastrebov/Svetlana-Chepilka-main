import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { language } = useLanguage();

  const privacyPolicy = {
    ru: {
      title: 'Политика конфиденциальности',
      sections: [
        {
          title: 'Контролер данных',
          content: 'Контролером данных является лицо, предоставляющее консультацию по здоровью. Для запросов по обработке данных свяжитесь с нами через указанные контактные данные в анкете.',
        },
        {
          title: 'Правовая основа обработки',
          content: 'Обработка персональных данных осуществляется на основании вашего добровольного согласия. Этот сервис работает в соответствии с Законом о конфиденциальности потребителей Калифорнии (CCPA) и применимыми законами США о конфиденциальности. Вы можете в любое время отозвать свое согласие.',
        },
        {
          title: 'Какие данные мы собираем',
          content: 'Мы собираем персональные данные, которые вы предоставляете в анкете: имя, возраст, вес, информацию о состоянии здоровья, симптомы, жалобы, аллергии, историю болезней и контактные данные (Telegram или Instagram). Предоставление данных является добровольным, но необходимо для предоставления консультации.',
        },
        {
          title: 'Зачем мы собираем данные',
          content: 'Данные собираются исключительно для предоставления консультации по здоровью. Мы используем эту информацию для анализа вашего состояния и подготовки рекомендаций. Данные не используются для автоматизированного принятия решений или профилирования.',
        },
        {
          title: 'Куда отправляются данные',
          content: 'Данные отправляются в Telegram-бот через официальный API Telegram. Сообщение с вашей анкетой отправляется в защищенный чат для обработки консультантом. Telegram обрабатывает данные в соответствии с применимыми законами о защите данных.',
        },
        {
          title: 'Как долго хранятся данные',
          content: 'Данные хранятся в Telegram-чате до момента завершения консультации или до момента отзыва вашего согласия. После завершения консультации или отзыва согласия вы можете запросить удаление ваших данных. Мы удалим ваши данные в течение 45 дней с момента запроса, как требуется CCPA.',
        },
        {
          title: 'Ваши права по CCPA',
          content: 'В соответствии с Законом о конфиденциальности потребителей Калифорнии (CCPA) и применимыми законами США о конфиденциальности, вы имеете право: (1) Знать, какие персональные данные собираются, используются, передаются или продаются; (2) Удалять персональную информацию, хранящуюся у нас; (3) Отказаться от продажи персональной информации (мы не продаем вашу информацию); (4) На недискриминацию при осуществлении ваших прав на конфиденциальность. Вы можете в любое время отозвать согласие на обработку данных.',
        },
        {
          title: 'Как реализовать ваши права',
          content: 'Для реализации ваших прав вы можете: (1) Посетить страницу запросов данных на /data-request для просмотра и удаления ваших отправленных анкет напрямую; (2) Связаться с нами через Telegram или Instagram, если вам нужна дополнительная помощь. Мы обработаем ваш запрос в течение 45 дней с момента получения, как требуется CCPA.',
        },
        {
          title: 'Как реализовать ваши права',
          content: 'Для реализации ваших прав вы можете: (1) Посетить страницу запросов данных на /data-request для просмотра и удаления ваших отправленных анкет напрямую; (2) Связаться с нами через Telegram или Instagram, если вам нужна дополнительная помощь. Мы обработаем ваш запрос в течение 45 дней с момента получения, как требуется CCPA.',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: 'Information We Collect',
          content: 'We collect the following categories of personal information that you voluntarily provide in the questionnaire: (1) Identifiers: name, email address, Telegram username, Instagram username, phone number; (2) Health information: age, weight, symptoms, complaints, allergies, medical history, health conditions; (3) Other information: any additional information you choose to provide in the questionnaire. We do not collect information automatically through cookies or tracking technologies.',
        },
        {
          title: 'How We Use Your Information',
          content: 'We use the personal information you provide solely for the purpose of providing health consultation services. Specifically, we use this information to: analyze your health condition, prepare personalized recommendations, communicate with you about your consultation, and improve our consultation services. We do not use your information for automated decision-making, profiling, advertising, or commercial purposes. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
        },
        {
          title: 'How We Share Your Information',
          content: 'Your questionnaire data is sent to a Telegram bot through the official Telegram API for processing by a health consultant. Telegram processes data in accordance with its privacy policy. We do not share, sell, or disclose your personal information to third parties except as necessary to provide the consultation service. We do not share your information with advertisers, data brokers, or other third parties for commercial purposes.',
        },
        {
          title: 'Data Security',
          content: 'We implement reasonable security measures to protect your personal information. Data is transmitted securely through Telegram\'s encrypted API. However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.',
        },
        {
          title: 'Data Retention',
          content: 'We retain your personal information in the Telegram chat for as long as necessary to provide the consultation service or until you request deletion. You may request deletion of your data at any time. We will delete your data within 45 days of receiving your request, as required by CCPA. After deletion, we may retain certain information as required by law or for legitimate business purposes.',
        },
        {
          title: 'Your Rights Under CCPA',
          content: 'As a California resident, you have the following rights under the California Consumer Privacy Act (CCPA): (1) Right to Know - You have the right to request information about what personal information we collect, use, disclose, or sell; (2) Right to Delete - You have the right to request deletion of your personal information; (3) Right to Opt-Out - You have the right to opt-out of the sale of personal information (we do not sell your information); (4) Right to Non-Discrimination - We will not discriminate against you for exercising your privacy rights. These rights apply to all U.S. residents, not just California residents.',
        },
        {
          title: 'How to Exercise Your Rights',
          content: 'To exercise your rights, you can: (1) Visit our Data Request page at /data-request to view and delete your submitted questionnaires directly; (2) Contact us via email at schepilka@gmail.com, Telegram, or Instagram if you need additional assistance. We will verify your identity before processing your request. We will respond to your request within 45 days, as required by CCPA. You may designate an authorized agent to make a request on your behalf by providing written authorization.',
        },
        {
          title: 'Children\'s Privacy (COPPA)',
          content: 'This service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13 without verifiable parental consent. If you are a parent or guardian and believe your child under 13 has provided us with personal information, please contact us immediately at schepilka@gmail.com to have that information deleted. We comply with the Children\'s Online Privacy Protection Act (COPPA).',
        },
        {
          title: 'Changes to This Privacy Policy',
          content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the service after such changes constitutes your acceptance of the updated Privacy Policy.',
        },
        {
          title: 'Contact Information',
          content: 'If you have questions about this Privacy Policy or wish to exercise your rights, please contact: Svetlana Chepilka, 4763 69th Street, Sacramento, CA 95820, Email: schepilka@gmail.com. For privacy-related requests, please include "Privacy Request" in the subject line.',
        },
      ],
    },
  };

  const policy = privacyPolicy[language];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {policy.title}
          </DialogTitle>
          <DialogDescription>
            {language === 'ru'
              ? 'Информация о сборе и обработке персональных данных'
              : 'Information about collection and processing of personal data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {policy.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

