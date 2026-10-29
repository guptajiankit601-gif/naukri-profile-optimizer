import type { Metadata } from 'next';
import './globals.css';
import { ReportProvider } from '@/lib/context/ReportContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata: Metadata = {
  title: BRAND_CONFIG.metaTitle,
  description: BRAND_CONFIG.metaDescription,
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  },
  openGraph: {
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.descriptor}`,
    description: BRAND_CONFIG.tagline,
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Synchronous script to prevent theme/appearance flash and ensure runtime polyfills */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Polyfill Uint8Array.prototype.toHex
                  if (typeof Uint8Array !== 'undefined' && typeof Uint8Array.prototype.toHex !== 'function') {
                    Uint8Array.prototype.toHex = function() {
                      return Array.from(this, function(b) { return b.toString(16).padStart(2, '0'); }).join('');
                    };
                  }

                  var stored = localStorage.getItem('careerup:theme') || localStorage.getItem('careerlens:theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark' || (stored === 'system' && prefersDark) || (!stored && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }

                  var density = localStorage.getItem('careerup:density') || localStorage.getItem('careerlens:density');
                  if (density === 'compact') {
                    document.documentElement.classList.add('density-compact');
                  }

                  var textSize = localStorage.getItem('careerup:text-size') || localStorage.getItem('careerlens:text-size');
                  if (textSize === 'large') {
                    document.documentElement.classList.add('text-large');
                  }

                  var motion = localStorage.getItem('careerup:reduced-motion') || localStorage.getItem('careerlens:reduced-motion');
                  if (motion === 'true') {
                    document.documentElement.classList.add('reduced-motion');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#F8FAFC] dark:bg-[#0B1422] text-slate-900 dark:text-slate-100 antialiased font-sans min-h-screen transition-colors duration-200 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
        <ThemeProvider>
          <ReportProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </ReportProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
