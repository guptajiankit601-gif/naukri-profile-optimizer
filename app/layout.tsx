import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naukri Profile Optimizer | 6-Second Recruiter Simulation',
  description: 'Recruiter-perspective analysis for Indian job boards. Simulate 6-second recruiter scans, identify missing keywords, and get a 7-day action plan.',
  openGraph: {
    title: 'Naukri Profile Optimizer',
    description: 'Recruiter-perspective analysis for Indian job boards. Free, no-auth, local-only.',
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
      <body className="bg-[#0F2233] text-slate-100 antialiased selection:bg-[#FF7582] selection:text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
