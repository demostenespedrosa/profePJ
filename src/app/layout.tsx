import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import PWARegister from '@/components/pwa-register';
import PWAInstallPrompt from '@/components/pwa-install-prompt';

export const metadata: Metadata = {
  title: 'Profe PJ',
  description: 'Seu amigo organizador para a vida de professor MEI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#A076F9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Profe PJ" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className="font-body antialiased bg-gray-100 dark:bg-black">
        <PWARegister />
        <FirebaseClientProvider>
            {children}
            <PWAInstallPrompt />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}