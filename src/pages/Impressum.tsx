import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const impressumContent = {
  ru: {
    title: 'Правовая информация',
    backToHome: 'Вернуться на главную',
    impressum: 'Правовая информация',
    accordingTo: 'Контактная информация',
    nameLabel: 'Имя и фамилия:',
    name: 'Светлана Чепилка',
    addressLabel: 'Адрес:',
    address: '4763 69-я улица\nСакраменто, Калифорния\n95820',
    emailLabel: 'Электронная почта:',
    email: 'schepilka@gmail.com',
    responsibleLabel: 'Владелец контента:',
  },
  en: {
    title: 'About & Contact',
    backToHome: 'Back to home',
    impressum: 'About & Contact',
    accordingTo: 'Contact Information',
    nameLabel: 'First and Last Name:',
    name: 'Svetlana Chepilka',
    addressLabel: 'Address:',
    address: '4763 69th Street\nSacramento, CA\n95820',
    emailLabel: 'E-Mail:',
    email: 'schepilka@gmail.com',
    responsibleLabel: 'Content Owner:',
  },
};

const Impressum: React.FC = () => {
  const { language } = useLanguage();
  const currentLanguage = language || 'ru';
  const content = impressumContent[currentLanguage] || impressumContent.ru;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Home className="w-4 h-4" />
            {content.backToHome}
          </Link>
        </div>

        <div className="card-wellness space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-4">{content.impressum}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {content.accordingTo}
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.nameLabel}</h3>
              <p>{content.name}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.addressLabel}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{content.address}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.emailLabel}</h3>
              <p>
                <a 
                  href={`mailto:${content.email}`}
                  className="text-primary hover:underline"
                >
                  {content.email}
                </a>
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">
                {content.responsibleLabel}
              </h3>
              <p>
                {content.name}<br />
                {content.address}
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Impressum;

