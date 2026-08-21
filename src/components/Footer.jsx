import { getSiteFooterSettings } from '@/lib/site-settings';
import { EN_OFFICE_ADDRESS, FOOTER_UI } from '@/lib/i18n';

export default async function Footer({ locale = 'ko' }) {
  const { officeAddress, representativeName, mainPhone, faxNumber } = await getSiteFooterSettings();
  const ui = FOOTER_UI[locale] ?? FOOTER_UI.ko;
  const address = locale === 'en' ? EN_OFFICE_ADDRESS : officeAddress;

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__sns" aria-label="SNS LINK">
          <span className="footer__sns-label">SNS LINK</span>
          <div className="footer__sns-icons" aria-label={ui.snsGroup}>
            <a
              className="footer__sns-icon"
              href="https://www.instagram.com/worldrights_official?igsh=MTJjcDFlN2Z2Z3Voeg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ui.instagramAria}
            >
              <img
                className="footer__sns-img"
                src="/images/instagram.svg"
                width="22"
                height="22"
                alt={ui.instagram}
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              className="footer__sns-icon"
              href="https://www.facebook.com/worldrightsofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ui.facebookAria}
            >
              <img
                className="footer__sns-img"
                src="/images/facebook.svg"
                width="22"
                height="22"
                alt={ui.facebook}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
        <p className="footer__line">
          <span className="footer__label">{ui.office}</span>{' '}
          <span className="footer__value">{address}</span>
        </p>
        <p className="footer__line">
          <span className="footer__label">{ui.representative}</span>{' '}
          <span className="footer__value">{representativeName}</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">{ui.phone}</span>{' '}
          <span className="footer__value">{mainPhone}</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">{ui.fax}</span>{' '}
          <span className="footer__value">{faxNumber}</span>
        </p>
        <p className="footer__copyright">ⓒ WORLD RIGHTS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
