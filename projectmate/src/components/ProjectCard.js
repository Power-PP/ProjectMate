import { BookmarkIcon, DevelopersIcon } from './Icons';

function ProjectCard({ project, compact = false, saved = false, onToggleSaved }) {
  const statusClass = project.status.toLowerCase().replace(' ', '-');

  return (
    <article className={compact ? 'project-card compact-card' : 'project-card'}>
      <div className="card-topline">
        <span className={`status-pill ${statusClass}`}>{project.status}</span>
        <strong>{project.match}% match</strong>
      </div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <div className="mini-stack">
        {project.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <div className="card-footer">
        <span>
          <DevelopersIcon size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
          {project.owner}
        </span>
        <span>{project.openings} openings</span>
      </div>
      {!compact && (
        <div className="card-actions">
          <button className="primary-action" type="button">Apply</button>
          <button className="secondary-action" type="button" onClick={onToggleSaved} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <BookmarkIcon size={16} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
