import { DashboardIcon, ProjectsIcon, DevelopersIcon } from './Icons';
import Logo from './Logo';

function AuthProductPreview() {
  return (
    <div className="product-preview" aria-label="ProjectMate product preview">
      <div className="preview-window">
        <div className="preview-toolbar">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="preview-content">
          <aside className="preview-sidebar">
            <Logo size={24} />
            <span style={{ background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DashboardIcon size={14} style={{ color: 'var(--primary)' }} />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ProjectsIcon size={14} style={{ opacity: 0.6 }} />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DevelopersIcon size={14} style={{ opacity: 0.6 }} />
            </span>
          </aside>
          <section className="preview-main">
            <div className="preview-search" style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Search projects, developers, or stacks...
            </div>
            <div className="preview-project">
              <div>
                <strong style={{ fontSize: '0.85rem' }}>AI Code Review Buddy</strong>
                <p>94% match</p>
              </div>
              <button type="button">Apply</button>
            </div>
            <div className="preview-grid">
              <span style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>Matches</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>12 Active</span>
              </span>
              <span style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>Inbox</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>3 New</span>
              </span>
              <span style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>Match Rate</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', background: 'none', width: 'auto', height: 'auto', borderRadius: 0 }}>94%</span>
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AuthProductPreview;
