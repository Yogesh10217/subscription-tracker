import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SubPulse — Intelligent Subscription Tracker',
  description:
    'Manage, analyze, and optimize your personal and enterprise recurring subscriptions with real-time analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Light-mode only: serif design system is intrinsically warm and light.
    // darkMode: 'class' stays in tailwind.config.js for future toggle optionality.
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
