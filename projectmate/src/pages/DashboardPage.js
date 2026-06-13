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
          <button className="primary-action" type="button" onClick={() => onPageChange('projects')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
          <ul className="activity-list">
            {notifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
