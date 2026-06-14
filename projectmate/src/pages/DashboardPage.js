import DeveloperList from '../components/DeveloperList';
import MetricCard from '../components/MetricCard';
import PanelHeader from '../components/PanelHeader';
import ProjectCard from '../components/ProjectCard';
import { PlusIcon } from '../components/Icons';

function DashboardPage({ currentUser, projects, developers, notifications, onPageChange, onViewProfile }) {
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = currentUser && currentUser.name ? currentUser.name.split(' ')[0] : 'Developer';

  return (
    <section className="page">
      <div className="page-heading split">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{getGreeting()}, {firstName}</h1>
          <p>Recommended work, team updates, and collaboration signals in one place.</p>
        </div>
        <div className="heading-actions">
          <button className="secondary-action" type="button" onClick={() => onPageChange('developers')}>
            Find developers
          </button>
          <button className="primary-action" type="button" onClick={() => onPageChange('create-project')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusIcon size={16} />
            <span>Create project</span>
          </button>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard value="4" label="Active projects" />
        <MetricCard value="7" label="Applications" />
        <MetricCard value="12" label="Saved developers" />
        <MetricCard value="94%" label="Best match" />
      </div>

      <div className="dashboard-grid">
        <section className="panel wide">
          <PanelHeader title="Recommended projects" action="View all" onClick={() => onPageChange('projects')} />
          <div className="project-list compact">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader title="Suggested developers" action="Browse" onClick={() => onPageChange('developers')} />
          <DeveloperList developers={developers.slice(0, 3)} onViewProfile={onViewProfile} />
        </section>

        <section className="panel">
          <PanelHeader title="Recent activity" action="Open" onClick={() => onPageChange('notifications')} />
          <ul className="activity-list" style={{ padding: 0, listStyle: 'none' }}>
            {notifications && notifications.length > 0 ? (
              notifications.slice(0, 3).map((item) => (
                <li 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '10px', 
                    fontSize: '0.85rem', 
                    padding: '12px 0', 
                    borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.05))',
                    opacity: item.read ? 0.75 : 1
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: item.read ? 'transparent' : 'var(--primary, #6366f1)', 
                    border: item.read ? '1px solid var(--text-muted)' : 'none',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: item.read ? '500' : '600' }}>
                      {item.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '12px 0' }}>
                No recent activity.
              </li>
            )}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
