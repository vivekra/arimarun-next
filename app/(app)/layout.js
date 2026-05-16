import { DM_Mono, Syne } from 'next/font/google';
import './dashboard.css';

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--mono' });
const syne = Syne({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--display' });

export const metadata = {
  title: 'ArimaRun — Your Cloud Desktop',
  description: 'Access your cloud desktop from any browser, anywhere.',
};

export default function AppLayout({ children }) {
  return (
    <html lang="en" className={`${dmMono.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
