import { initials } from '../utils/format';

function DeveloperList({ developers }) {
  return (
    <div className="developer-list">
      {developers.map((developer) => (
        <article className="developer-row" key={developer.name}>
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
