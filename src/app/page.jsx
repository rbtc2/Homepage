'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import LoginModal from '@/components/LoginModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Header
        onLoginOpen={() => setIsLoginOpen(true)}
        isLoginOpen={isLoginOpen}
      />
      <HeroBanner />
      <main className="main" role="main">
        <div className="main__surface">
          <p className="main__lead">본문 영역</p>
          <p className="main__note">하단 콘텐츠는 이후 단계에서 구성됩니다.</p>
        </div>
      </main>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <Footer />
    </>
  );
}
