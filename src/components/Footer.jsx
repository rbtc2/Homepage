export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__sns" aria-label="SNS LINK">
          <span className="footer__sns-label">SNS LINK</span>
          <div className="footer__sns-icons" aria-label="인스타그램/페이스북">
            <a
              className="footer__sns-icon"
              href="https://www.instagram.com/"
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
              href="https://www.facebook.com/"
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
          <span className="footer__value">서울특별시</span>
        </p>
        <p className="footer__line">
          <span className="footer__label">대표자</span>{' '}
          <span className="footer__value">조은혜</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">대표 전화</span>{' '}
          <span className="footer__value">010-0000-0000</span>
          <span className="footer__sep">|</span>
          <span className="footer__label">팩스</span>{' '}
          <span className="footer__value">00-000-0000</span>
        </p>
        <p className="footer__copyright">ⓒ EJJ. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
