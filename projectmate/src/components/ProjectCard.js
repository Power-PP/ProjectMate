import { BookmarkIcon, DevelopersIcon } from './Icons';

function ProjectCard({ project, compact = false, saved = false, onToggleSaved, currentUser, onApply }) {
  const statusClass = project.status.toLowerCase().replace(' ', '-');

  const isOwner = currentUser && project.ownerId === currentUser.id;
  const isMember = currentUser && project.memberIds && project.memberIds.includes(currentUser.id);
  const isApplied = currentUser && project.applicantIds && project.applicantIds.includes(currentUser.id);

  const calculateMatch = () => {
    if (!currentUser || !currentUser.skills || !project.stack || project.stack.length === 0) {
      return 0;
    }
    const userSkills = currentUser.skills.map(s => s.toLowerCase());
    const matches = project.stack.filter(tech => userSkills.includes(tech.toLowerCase())).length;
    return Math.round((matches / project.stack.length) * 100);
  };

  const matchPercent = project.match !== undefined ? project.match : calculateMatch();

  return (
    <article className={compact ? 'project-card compact-card' : 'project-card'}>
      <div className="card-topline">
        <span className={`status-pill ${statusClass}`}>{project.status}</span>
        <strong>{matchPercent}% match</strong>
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
          {project.ownerName || project.owner}
        </span>
        <span>{project.openings} openings</span>
      </div>
      {!compact && (
        <div className="card-actions">
          {isOwner ? (
            <button className="primary-action" type="button" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Your Project</button>
          ) : isMember ? (
            <button className="primary-action" type="button" disabled style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-color)' }}>Joined</button>
          ) : isApplied ? (
            <button className="primary-action" type="button" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Applied</button>
          ) : (
            <button className="primary-action" type="button" onClick={onApply}>Apply</button>
          )}
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
