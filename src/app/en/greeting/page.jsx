export const metadata = {
  title: 'Greeting',
  description:
    'Walk with WORLD RIGHTS on a journey that connects dignity and builds independence for tomorrow.',
};

export default function EnGreetingPage() {
  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">About</p>
          <h1 className="page-header__title" id="greeting-heading">
            Greeting
          </h1>
        </div>
      </div>

      <article className="gt-wrap" aria-labelledby="greeting-heading">
        <div className="gt-layout gt-layout--with-photo">
          <div className="gt-prose">
            <header className="gt-section-head">
              <p className="gt-section-head__eyebrow">Greeting</p>
              <hr className="gt-section-head__rule" />
            </header>

            <div className="gt-prose__lead-wrap">
              <p className="gt-prose__lead">
                Walk with WORLD RIGHTS on a journey that connects dignity and builds
                independence for tomorrow.
              </p>
            </div>

            <div className="gt-prose__body">
              <p>
                The diversity of our society continues to deepen, yet exclusion and
                discrimination still remain. WORLD RIGHTS provides professional
                independent-living support and human-rights advocacy so that every
                social minority can stand as a full member of our community.
              </p>
              <p>
                We will prove, through transparent and sincere work, that the
                intercultural values WORLD RIGHTS proposes can become a new standard
                for our society. We will keep walking toward a world where universal
                human rights are common sense.
              </p>
            </div>

            <footer className="gt-prose__closing">
              <p>Thank you.</p>
            </footer>
          </div>

          <aside className="gt-aside" aria-label="Portrait accompanying the greeting">
            <figure className="gt-portrait">
              <img
                src="/images/greeting/representative.webp"
                alt="WORLD RIGHTS representative"
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </aside>
        </div>
      </article>
    </main>
  );
}
