import { initials } from '../utils/format';

function DeveloperList({ developers, onViewProfile }) {
  return (
    <div className="developer-list">
      {developers.map((developer) => (
        <article 
          className="developer-row" 
          key={developer.id || developer.name}
          onClick={() => onViewProfile && onViewProfile(developer.id)}
          style={{ cursor: onViewProfile ? 'pointer' : 'default' }}
        >
          <div className="avatar small">{initials(developer.name)}</div>
          <div>
            <h3>{developer.name}</h3>
            <p style={{ margin: '2px 0 6px 0' }}>{developer.role}</p>
            <div className="mini-stack" style={{ gap: '4px' }}>
              {developer.skills.slice(0, 2).map((skill) => (
                <span key={skill} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default DeveloperList;
