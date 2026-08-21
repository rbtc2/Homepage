export const metadata = {
  title: 'Greeting',
  description:
    'Join WORLD RIGHTS in connecting people through dignity and building pathways to self-reliance for tomorrow.',
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
                Join WORLD RIGHTS in connecting people through dignity and building
                pathways to self-reliance for tomorrow.
              </p>
            </div>

            <div className="gt-prose__body">
              <p>
                Our society is becoming increasingly diverse, yet exclusion and
                discrimination remain a reality for many. WORLD RIGHTS develops
                professional programs that strengthen self-reliance and carries out
                human rights advocacy so that every member of a social minority can
                stand as an active and empowered member of our shared community.
              </p>
              <p>
                Through transparent and sincere action, we will work to make the value
                of interculturalism that WORLD RIGHTS stands for a new standard in our
                society. We will continue moving forward toward a world where
                universal human rights are simply common sense.
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
