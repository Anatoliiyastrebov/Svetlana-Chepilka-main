'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryCard } from '@/components/CategoryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Sparkles, LogIn, User, LogOut, Loader2 } from 'lucide-react';
import type { TelegramWebAppUser } from '../telegram-webapp';

// Bot username for Telegram Mini App
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SvetlanaChepilkaBot';
const MINI_APP_NAME = process.env.NEXT_PUBLIC_TELEGRAM_MINI_APP_NAME || 'Authorization';

export default function HomePage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const [telegramUser, setTelegramUser] = useState<TelegramWebAppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check for saved user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('telegram_user');
    if (savedUser) {
      try {
        setTelegramUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('telegram_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Handle auth_token from URL (after Telegram redirect)
  const handleAuthToken = useCallback(async (authToken: string) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`/api/auth/get-user-data?token=${authToken}`);
      const result = await response.json();

      if (result.success && result.user) {
        setTelegramUser(result.user);
        localStorage.setItem('telegram_user', JSON.stringify(result.user));
        
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('auth_token');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  useEffect(() => {
    const authToken = searchParams.get('auth_token');
    if (authToken && !telegramUser) {
      handleAuthToken(authToken);
    }
  }, [searchParams, telegramUser, handleAuthToken]);

  // Handle Telegram login
  const handleTelegramLogin = async () => {
    setIsAuthenticating(true);
    try {
      // Create session
      const response = await fetch('/api/auth/create-session', {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success && result.sessionId) {
        // Redirect to Telegram Mini App with session ID
        const telegramUrl = `https://t.me/${BOT_USERNAME}/${MINI_APP_NAME}?startapp=${result.sessionId}`;
        window.location.href = telegramUrl;
      } else {
        console.error('Failed to create session');
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setTelegramUser(null);
    localStorage.removeItem('telegram_user');
  };

  // Get display name
  const getDisplayName = (user: TelegramWebAppUser): string => {
    if (user.username) return `@${user.username}`;
    if (user.last_name) return `${user.first_name} ${user.last_name}`;
    return user.first_name;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t('welcome')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('siteTitle')}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('welcomeDescription')}
          </p>
        </section>

        {/* Telegram Auth Section */}
        <section className="max-w-md mx-auto mb-12">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : telegramUser ? (
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {getDisplayName(telegramUser)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ru' ? 'Авторизован через Telegram' : 'Authorized via Telegram'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                title={language === 'ru' ? 'Выйти' : 'Logout'}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleTelegramLogin}
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
            >
              {isAuthenticating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>
                {isAuthenticating
                  ? (language === 'ru' ? 'Авторизация...' : 'Authenticating...')
                  : (language === 'ru' ? 'Войти через Telegram' : 'Login with Telegram')}
              </span>
            </button>
          )}
        </section>

        {/* Categories Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-foreground mb-8 flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            {t('selectCategory')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard
              type="infant"
              title={t('infantTitle')}
              description={t('infantDescription')}
            />
            <CategoryCard
              type="child"
              title={t('childTitle')}
              description={t('childDescription')}
            />
            <CategoryCard
              type="woman"
              title={t('womanTitle')}
              description={t('womanDescription')}
            />
            <CategoryCard
              type="man"
              title={t('manTitle')}
              description={t('manDescription')}
            />
          </div>
        </section>

        {/* Decorative elements */}
        <div className="fixed top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        <div className="fixed bottom-1/4 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
      </main>
      
      <Footer />
    </div>
  );
}
