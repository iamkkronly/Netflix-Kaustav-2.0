"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  useEffect(() => {
    if (!botUsername) {
      setError("Telegram Bot Username is not configured. Please set NEXT_PUBLIC_TELEGRAM_BOT_USERNAME in your environment variables.");
    }

    window.onTelegramAuth = async (user) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (res.ok) {
          router.push('/dashboard');
        } else {
          const data = await res.json();
          setError(data.message || 'Telegram login failed. Please try again.');
        }
      } catch (err) {
        setError('An unexpected error occurred during login. Please check the console.');
        console.error('Error during Telegram login:', err);
      } finally {
        setLoading(false);
      }
    };
  }, [router, botUsername]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-4">Login to CloudRay</h1>
        <p className="text-gray-400 mb-6">Click the button below to log in with your Telegram account.</p>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}

        {botUsername ? (
          <div id="telegram-login-widget">
            <Script
              src="https://telegram.org/js/telegram-widget.js?22"
              strategy="afterInteractive"
            />
            <div
              className="telegram-login-button"
              data-telegram-login={botUsername}
              data-size="large"
              data-onauth="onTelegramAuth(user)"
              data-request-access="write"
            ></div>
          </div>
        ) : (
          <div className="text-yellow-400">Waiting for bot configuration...</div>
        )}

        {loading && <p className="text-gray-400 mt-4">Authenticating...</p>}

        <p className="text-xs text-gray-500 mt-6">
          CloudRay uses your Telegram account for authentication and storage. We do not store your private data.
        </p>
      </div>
    </div>
  );
}