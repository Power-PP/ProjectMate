import { initials } from '../utils/format';
import { MapPinIcon, ClockIcon } from '../components/Icons';

function DevelopersPage({ developers }) {
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Developer search</p>
        <h1>Find collaborators</h1>
        <p>Shortlist people by stack, role, location, and weekly availability.</p>
      </div>
      <div className="developer-grid">
        {developers.map((developer) => (
          <article className="developer-card" key={developer.name}>
            <div className="avatar">{initials(developer.name)}</div>
            <h2>{developer.name}</h2>
            <p>{developer.role}</p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPinIcon size={13} />
                {developer.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ClockIcon size={13} />
                {developer.availability}
              </span>
            </div>
            <div className="mini-stack">
              {developer.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <button className="secondary-action" type="button">Invite</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DevelopersPage;
