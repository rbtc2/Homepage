export const metadata = {
  title: 'Greeting',
  description:
    'WORLD RIGHTS stands with those working toward a society where identity does not limit possibility.',
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
                WORLD RIGHTS stands with those working toward a society where
                identity does not limit possibility.
              </p>
            </div>

            <div className="gt-prose__body">
              <p>
                Our society is becoming increasingly diverse, yet some people are
                still expected to live within roles defined for them and choices
                limited by their identity. Rather than asking what social minorities
                lack, WORLD RIGHTS begins by asking why the experiences, knowledge,
                and potential they already possess are not given the opportunities
                they deserve in our society.
              </p>
              <p>
                We create small but meaningful opportunities for people to
                participate in society through their own experiences and knowledge,
                and to shape new roles and choices for themselves. We are taking
                our first steps alongside migrant women, and we will continue to
                broaden the scope of our work by connecting and building solidarity
                with diverse social minority communities.
              </p>
              <p>
                We envision a society where no one’s possibilities are limited by
                their identity, and where different lives and experiences are valued
                equally. Toward a society where universal human rights are not
                treated as special demands, but simply as common sense, WORLD RIGHTS
                will continue to create small, concrete changes—steadily and with
                purpose.
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
