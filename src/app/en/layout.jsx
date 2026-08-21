import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: {
    default: 'WORLD RIGHTS',
    template: '%s | WORLD RIGHTS',
  },
};

export default function EnLayout({ children }) {
  return (
    <>
      <Header locale="en" />
      {children}
      <Footer locale="en" />
    </>
  );
}
