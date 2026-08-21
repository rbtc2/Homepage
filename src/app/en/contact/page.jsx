import { EN_OFFICE_ADDRESS } from '@/lib/i18n';

export const metadata = {
  title: 'Contact',
  description: 'Find WORLD RIGHTS in Songpa-gu, Seoul, and get in touch.',
};

const DR_ROAD_ADDRESS_KO =
  '서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호';

const DR_MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DR_ROAD_ADDRESS_KO)}`;
const DR_MAP_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DR_ROAD_ADDRESS_KO)}`;

function SubwayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="13" rx="2.5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" />
      <circle cx="8" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <line x1="9" y1="19" x2="7" y2="16.5" />
      <line x1="15" y1="19" x2="17" y2="16.5" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2" width="18" height="15" rx="2.5" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="12" y1="2" x2="12" y2="8" />
      <circle cx="7.5" cy="19" r="1.5" />
      <circle cx="16.5" cy="19" r="1.5" />
      <line x1="7.5" y1="17" x2="7.5" y2="17" />
      <path d="M5 17H3v-2h18v2h-2" />
    </svg>
  );
}

export default function EnContactPage() {
  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">About</p>
          <h1 className="page-header__title">Contact</h1>
        </div>
      </div>

      <div className="dr-wrap">
        <section aria-label="Map">
          <div className="dr-map">
            <iframe
              className="dr-map__iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.527748593839!2d127.1244142!3d37.495469199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca57c8ccde613%3A0x26de1cb60c14b30a!2z6rWt7KCc7J246raM7Jew64yAIOyblOuTnOudvOydtOy4oA!5e0!3m2!1sen!2skr!4v1778218163448!5m2!1sen!2skr"
              title="Map to WORLD RIGHTS"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        <section aria-label="Address and contact">
          <div className="dr-info-panel">
            <div className="dr-address">
              <p className="dr-address__eyebrow">Location</p>
              <div className="dr-address__main">
                <div>
                  <p className="dr-address__label">Address</p>
                  <p className="dr-address__value">{EN_OFFICE_ADDRESS}</p>
                </div>
              </div>
              <div className="dr-address__actions">
                <a
                  className="dr-cta dr-cta--fill"
                  href={DR_MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions in Google Maps. Opens in a new tab."
                >
                  Directions
                </a>
                <a
                  className="dr-cta dr-cta--ghost"
                  href={DR_MAP_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View location in Google Maps. Opens in a new tab."
                >
                  Map
                </a>
              </div>
            </div>

            <div className="dr-info-divider" aria-hidden="true" />

            <div className="dr-contact">
              <p className="dr-contact__eyebrow">Contact</p>
              <ul className="dr-contact__list">
                <li className="dr-contact__item">
                  <span className="dr-contact__sub">Phone</span>
                  <span className="dr-contact__val">070-8018-9232</span>
                </li>
                <li className="dr-contact__item">
                  <span className="dr-contact__sub">Fax</span>
                  <span className="dr-contact__val">0504-287-7334</span>
                </li>
                <li className="dr-contact__item">
                  <span className="dr-contact__sub">Hours</span>
                  <span className="dr-contact__val">Weekdays 08:30 – 17:30</span>
                  <span className="dr-contact__val dr-contact__val--note">Closed Saturdays, Sundays, and public holidays</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section aria-label="Public transit">
          <div className="dr-transport">
            <div className="dr-transport__header">
              <p className="dr-transport__eyebrow">Transit</p>
              <hr className="dr-transport__rule" />
            </div>

            <ul className="dr-transport__list">
              <li className="dr-trow">
                <div className="dr-trow__icon">
                  <SubwayIcon />
                </div>
                <h3 className="dr-trow__name">Subway</h3>
                <div className="dr-trow__details" aria-label="Subway directions">
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Line / station</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Subway{' '}
                      <span className="dr-line-badge dr-line-badge--3" title="Line 3">
                        3
                      </span>
                      {' '}National Police Hospital Station
                    </p>
                  </div>
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Exit / walk</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Take Exit 3, then turn right. About a one-minute walk.
                    </p>
                  </div>
                </div>
              </li>

              <li className="dr-trow">
                <div className="dr-trow__icon">
                  <BusIcon />
                </div>
                <h3 className="dr-trow__name">Bus</h3>
                <div className="dr-trow__details" aria-label="Bus directions">
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Routes</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Trunk 301, trunk 401, feeder 3319
                    </p>
                  </div>
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Stop / walk</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Alight at National Police Hospital Station, then walk about 200 m
                    </p>
                  </div>
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Routes</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Feeder 3322, feeder 3416
                    </p>
                  </div>
                  <div className="dr-trow__detail">
                    <span className="dr-trow__detail-key">Stop / walk</span>
                    <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                      Alight at National Police Hospital Station, then walk about 250 m
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
