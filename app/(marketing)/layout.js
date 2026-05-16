import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--mono' });

export const metadata = {
  title: 'ArimaRun — AI-Managed Container Hosting for Indian Startups',
  description: 'Deploy your app. We handle everything else. Enterprise-grade container infrastructure.',
};

export default function MarketingLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
