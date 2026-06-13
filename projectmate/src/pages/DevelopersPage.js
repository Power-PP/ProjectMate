import { initials } from '../utils/format';
import { MapPinIcon, ClockIcon } from '../components/Icons';

function DevelopersPage({ developers, onViewProfile }) {
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Developer search</p>
        <h1>Find collaborators</h1>
        <p>Shortlist people by stack, role, location, and weekly availability.</p>
      </div>
      <div className="developer-grid">
        {developers.map((developer) => (
          <article className="developer-card" key={developer.id || developer.name} style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              className="avatar" 
              onClick={() => onViewProfile && onViewProfile(developer.id)}
              style={{ cursor: 'pointer' }}
            >
              {initials(developer.name)}
            </div>
            <h2 
              onClick={() => onViewProfile && onViewProfile(developer.id)}
              style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              {developer.name}
            </h2>
            <p>{developer.role}</p>
            {developer.education && developer.education.college ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '14px', fontWeight: '500' }}>
                🎓 {developer.education.degree} • {developer.education.college}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px', alignItems: 'center' }}>
                {developer.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPinIcon size={13} />
                    {developer.location}
                  </span>
                )}
                {developer.availability && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ClockIcon size={13} />
                    {developer.availability}
                  </span>
                )}
              </div>
            )}
            <div className="mini-stack" style={{ marginBottom: '16px' }}>
              {developer.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
              <button 
                className="secondary-action" 
                type="button" 
                style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem' }}
                onClick={() => onViewProfile && onViewProfile(developer.id)}
              >
                Profile
              </button>
              <button 
                className="primary-action" 
                type="button" 
                style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem' }}
              >
                Invite
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DevelopersPage;
