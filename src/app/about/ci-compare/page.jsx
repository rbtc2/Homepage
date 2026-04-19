import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import '@/app/styles/ci-compare.css';

export const metadata = {
  title: 'CI 레이아웃 비교 | 월드라이츠',
  robots: { index: false, follow: false },
};

const LOGO_STORY = [
  'World Rights의 W와 R를 굽이치는 물결처럼 시각화하여 권리의 언어가 닿지 않는 곳까지 월드라이츠의 활동이 파동처럼 넓게 확산되어 세상의 긍정적인 변화를 이끌어내겠다는 의지를 담았습니다.',
];

const COLOR_NOTE =
  '맑고 깨끗한 블루는 월드라이츠가 지향하는 진정성과 전문성, 당사자의 존엄과 희망을 의미합니다.';

function PaletteBlock() {
  return (
    <div className="ci-opt-palette" aria-label="브랜드 컬러">
      <div className="ci-opt-swatch">
        <span
          className="ci-opt-swatch__chip"
          style={{ background: '#0071ce' }}
          aria-hidden
        />
        <div className="ci-opt-swatch__meta">
          <div className="ci-opt-swatch__hex">#0071ce</div>
          <p className="ci-opt-swatch__role">Primary · 맑은 블루</p>
        </div>
      </div>
      <div className="ci-opt-swatch">
        <span
          className="ci-opt-swatch__chip"
          style={{ background: '#001c65' }}
          aria-hidden
        />
        <div className="ci-opt-swatch__meta">
          <div className="ci-opt-swatch__hex">#001c65</div>
          <p className="ci-opt-swatch__role">Deep · 네이비</p>
        </div>
      </div>
      <p className="ci-opt__p" style={{ width: '100%', marginTop: '0.25rem' }}>
        {COLOR_NOTE}
      </p>
    </div>
  );
}

function LogoImg() {
  return (
    <img
      src="/images/ci-logo.svg"
      width={329}
      height={51}
      alt="국제인권연대 월드라이츠 CI 로고"
      decoding="async"
    />
  );
}

export default function CiComparePage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">내부 비교</p>
            <h1 className="page-header__title">CI 레이아웃 비교</h1>
          </div>
        </div>

        <div className="ci-compare">
          <Link className="ci-compare__back" href="/about">
            ← 소개 페이지로
          </Link>
          <h2 className="ci-compare__page-title">A · B · C · D 한 화면 비교</h2>
          <p className="ci-compare__hint">
            실제 CI 소개에 쓸 레이아웃을 고르기 위한 임시 페이지입니다. 배포 전 삭제하거나 링크를
            숨겨도 됩니다.
          </p>

          {/* A */}
          <section className="ci-opt ci-opt--a" aria-labelledby="ci-opt-a">
            <span className="ci-opt__badge">Option A</span>
            <h3 id="ci-opt-a" className="ci-opt__name">
              좌 로고 · 우 스토리 (+ 컬러)
            </h3>
            <div className="ci-opt-a__grid">
              <div className="ci-opt-logo">
                <LogoImg />
              </div>
              <div>
                <p className="ci-opt__sub">Logo</p>
                <h4 className="ci-opt__h">로고에 담긴 의미</h4>
                {LOGO_STORY.map((t) => (
                  <p key={t} className="ci-opt__p">
                    {t}
                  </p>
                ))}
                <p className="ci-opt__sub" style={{ marginTop: '1.25rem' }}>
                  Brand color
                </p>
                <PaletteBlock />
              </div>
            </div>
          </section>

          {/* B */}
          <section className="ci-opt ci-opt--b" aria-labelledby="ci-opt-b">
            <span className="ci-opt__badge">Option B</span>
            <h3 id="ci-opt-b" className="ci-opt__name">
              스토리 먼저 · 로고 블록 · 팔레트
            </h3>
            <div className="ci-opt-b__mark">
              <p className="ci-opt__sub">The mark</p>
              <h4 className="ci-opt__h">로고에 담긴 의미</h4>
              {LOGO_STORY.map((t) => (
                <p key={t} className="ci-opt__p">
                  {t}
                </p>
              ))}
            </div>
            <div className="ci-opt-b__logo-wrap">
              <div className="ci-opt-logo">
                <LogoImg />
              </div>
            </div>
            <p className="ci-opt__sub">Palette</p>
            <PaletteBlock />
          </section>

          {/* C */}
          <section className="ci-opt ci-opt--c" aria-labelledby="ci-opt-c">
            <span className="ci-opt__badge">Option C</span>
            <h3 id="ci-opt-c" className="ci-opt__name">
              스토리 / 로고 / 컬러 시스템 (스캔형)
            </h3>
            <p className="ci-opt__sub">Story</p>
            <h4 className="ci-opt__h">로고에 담긴 의미</h4>
            {LOGO_STORY.map((t) => (
              <p key={t} className="ci-opt__p">
                {t}
              </p>
            ))}
            <div className="ci-opt-c__logo-row">
              <div className="ci-opt-logo">
                <LogoImg />
              </div>
            </div>
            <p className="ci-opt-c__palette-title">Color system</p>
            <PaletteBlock />
          </section>

          {/* D */}
          <section className="ci-opt ci-opt--d" aria-labelledby="ci-opt-d">
            <span className="ci-opt__badge">Option D</span>
            <h3 id="ci-opt-d" className="ci-opt__name">
              세로 컬러 바 + 본문
            </h3>
            <div className="ci-opt-d__row">
              <div className="ci-opt-d__bar" aria-hidden />
              <div className="ci-opt-d__body">
                <p className="ci-opt__sub">CI</p>
                <h4 className="ci-opt__h">로고에 담긴 의미</h4>
                {LOGO_STORY.map((t) => (
                  <p key={t} className="ci-opt__p">
                    {t}
                  </p>
                ))}
                <div className="ci-opt-logo">
                  <LogoImg />
                </div>
                <p className="ci-opt__sub" style={{ marginTop: '1.25rem' }}>
                  Brand color
                </p>
                <PaletteBlock />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
