import type { Metadata } from 'next';
import { ToastProvider, ToastViewport, TooltipProvider } from '@polaris/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polaris App',
  description: 'A web service built on the Polaris design system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="light">
      <head>
        {/* Pretendard via CDN. Replace with next/font/local for production. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <TooltipProvider delayDuration={200}>
          <ToastProvider swipeDirection="right">
            {children}
            <ToastViewport />
          </ToastProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
