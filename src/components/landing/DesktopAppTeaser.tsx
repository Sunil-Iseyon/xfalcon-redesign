import './desktop-teaser.css';

const NOTIFY_MAILTO =
  'mailto:info@iseyon.com?subject=Notify%20me%20about%20the%20xFalcon%20desktop%20app';

export function DesktopAppTeaser() {
  return (
    <section className="section" id="desktop-app">
      <div className="container-xf">
        <div className="card-sunken desktop-card">
          <div className="desktop-copy">
            <p className="eyebrow">DESKTOP APP</p>
            <h2 className="heading-2 desktop-heading">xFalcon is coming to your desktop</h2>
            <p className="subhead desktop-subhead">
              The same governed answers, briefs, and board-ready outputs - as a native app for Mac
              and Windows.
            </p>
            <div className="desktop-actions">
              <span className="badge-soon">Coming soon</span>
              <a className="btn btn-secondary btn-sm" href={NOTIFY_MAILTO}>
                Notify me
              </a>
            </div>
          </div>

          <div className="desktop-art" aria-hidden="true">
            <div className="desktop-window">
              <div className="desktop-chrome">
                <span className="desktop-dot" />
                <span className="desktop-dot" />
                <span className="desktop-dot" />
                <span className="desktop-chrome-title" />
              </div>
              <div className="desktop-body">
                <span className="desktop-bar desktop-bar-accent" />
                <span className="desktop-bar desktop-bar-wide" />
                <span className="desktop-bar desktop-bar-medium" />
                <span className="desktop-bar desktop-bar-narrow" />
                <span className="desktop-bar desktop-bar-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
