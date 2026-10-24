import type { Metadata } from 'next';
import './globals.css';
import { ReportProvider } from '@/lib/context/ReportContext';

export const metadata: Metadata = {
  title: 'Naukri Profile Optimizer | 6-Second Recruiter Simulation',
  description: 'Deterministic resume optimization for Indian tech recruiters. Simulate 6-second recruiter scans, identify keyword gaps, and get a 7-day action plan.',
  openGraph: {
    title: 'Naukri Profile Optimizer',
    description: 'Deterministic resume optimization for Indian job boards. Free, client-side, fact-preserving.',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1521] text-slate-100 antialiased selection:bg-[#FF7582] selection:text-slate-900 font-sans min-h-screen">
        <ReportProvider>
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </ReportProvider>
      </body>
    </html>
  );
}
