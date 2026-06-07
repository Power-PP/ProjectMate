import ProjectCard from '../components/ProjectCard';

function MyProjectsPage({ ownedProjects, joinedProjects }) {
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Portfolio activity</p>
        <h1>My projects</h1>
        <p>Track projects you own, joined teams, and application progress.</p>
      </div>
      <div className="two-column">
        <section className="panel">
          <h2>Created by me</h2>
          <div className="project-list compact">
            {ownedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </div>
        </section>
        <section className="panel">
          <h2>Joined projects</h2>
          <div className="project-list compact">
            {joinedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default MyProjectsPage;
