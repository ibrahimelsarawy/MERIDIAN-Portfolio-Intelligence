import type { Metadata } from 'next';
import './globals.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const metadata: Metadata = {
  title: 'Meridian | Portfolio Decision Intelligence',
  description: 'Portfolio analytics and decision-support workbench built with Next.js, React, and TypeScript.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
