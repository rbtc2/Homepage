import './globals.css';

export const metadata = {
  title: '국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}
