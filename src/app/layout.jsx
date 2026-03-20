import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata = {
  title: 'EJJ 홈페이지',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}
