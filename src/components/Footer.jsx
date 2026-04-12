import { getSiteFooterSettings } from '@/lib/site-settings';

export default async function Footer() {
  const { officeAddress, representativeName, mainPhone, faxNumber } = await getSiteFooterSettings();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__sns" aria-label="SNS LINK">
          <span className="footer__sns-label">SNS LINK</span>
          <div className="footer__sns-icons" aria-label="인스타그램/페이스북">
            <a
              className="footer__sns-icon"
              href="https://www.instagram.com/worldrights_official?igsh=MTJjcDFlN2Z2Z3Voeg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램 링크"
            >
              <img
                className="footer__sns-img"
                src="/images/instagram.svg"
                width="22"
                height="22"
                alt="인스타그램"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              className="footer__sns-icon"
              href="https://www.facebook.com/worldrightsofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="페이스북 링크"
            >
              <img
                className="footer__sns-img"
                src="/images/facebook.svg"
                width="22"
                height="22"
                alt="페이스북"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
        <p className="footer__line">
          <span className="footer__label">사무실</span>{' '}
          <span className="footer__value">{officeAddress}</span>
        </p>
        <p className="footer__line">
          <span className="footer__label">대표자</span>{' '}
          <span className="footer__value">{representativeName}</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">대표 전화</span>{' '}
          <span className="footer__value">{mainPhone}</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">팩스</span>{' '}
          <span className="footer__value">{faxNumber}</span>
        </p>
        <p className="footer__copyright">ⓒ WORLD RIGHTS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
