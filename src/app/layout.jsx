import { GoogleTagManager } from '@next/third-parties/google';
import { Noto_Sans_KR } from 'next/font/google';
import { headers } from 'next/headers';
import SitePopupsLoader from '@/components/SitePopupsLoader';
import './globals.css';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NV9MRFDM';

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata = {
  title: '국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export default async function RootLayout({ children }) {
  const headerList = await headers();
  const locale = headerList.get('x-locale') === 'en' ? 'en' : 'ko';

  return (
    <html lang={locale} className={notoSansKR.variable}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <GoogleTagManager gtmId={GTM_ID} />
      <body>
        {children}
        <SitePopupsLoader locale={locale} />
      </body>
    </html>
  );
}
