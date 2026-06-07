import DeveloperList from '../components/DeveloperList';
import ProjectCard from '../components/ProjectCard';
import { developers } from '../data/mockData';

function ProjectsPage({
  projects,
  searchTerm,
  selectedStatus,
  savedProjects,
  onSearchChange,
  onStatusChange,
  onToggleSaved,
}) {
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Project discovery</p>
        <h1>Explore projects</h1>
        <p>Search by skill, role, status, and collaboration fit.</p>
      </div>

      <div className="filter-toolbar">
        <label>
          Search projects or skills
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="React, Java, API..."
          />
        </label>
        <label>
          Status
          <select value={selectedStatus} onChange={(event) => onStatusChange(event.target.value)}>
            <option>All</option>
            <option>Open</option>
            <option>Hiring</option>
            <option>In progress</option>
          </select>
        </label>
        <label className="toggle-row">
          <input type="checkbox" defaultChecked />
          Remote
        </label>
      </div>

      <div className="explore-grid">
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              saved={savedProjects.includes(project.id)}
              onToggleSaved={() => onToggleSaved(project.id)}
            />
          ))}
        </div>

        <aside className="panel side-panel">
          <h2>Trending skills</h2>
          <div className="mini-stack">
            <span>Spring Boot</span>
            <span>React</span>
            <span>MongoDB</span>
            <span>JWT</span>
            <span>Docker</span>
          </div>
          <h2>Recommended teammates</h2>
          <DeveloperList developers={developers.slice(0, 2)} />
        </aside>
      </div>
    </section>
  );
}

export default ProjectsPage;
