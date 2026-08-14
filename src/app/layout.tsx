import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SubPulse — Intelligent Subscription Tracker',
  description: 'Manage, analyze, and optimize your personal and enterprise recurring subscriptions with real-time analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#13131b] text-[#e4e1ed] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
