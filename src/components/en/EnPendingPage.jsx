import EnComingSoonBanner from '@/components/en/EnComingSoonBanner';

export default function EnPendingPage({ children }) {
  return (
    <>
      <EnComingSoonBanner />
      {children}
    </>
  );
}
