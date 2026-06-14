import ProjectCard from '../components/ProjectCard';

function MyProjectsPage({ 
  ownedProjects, 
  joinedProjects, 
  incomingApps = [], 
  outgoingApps = [], 
  onAcceptApp, 
  onRejectApp 
}) {
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
          <div className="project-list">
            {ownedProjects.length > 0 ? (
              ownedProjects.map((project) => (
                <div key={project.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <ProjectCard project={project} compact />
                  
                  {/* List incoming pending applications for this project */}
                  {incomingApps.filter(app => app.projectId === project.id && app.status === 'Pending').length > 0 && (
                    <div style={{ marginTop: '14px', paddingLeft: '16px', borderLeft: '3px solid var(--primary)' }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Pending Applications:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {incomingApps.filter(app => app.projectId === project.id && app.status === 'Pending').map(app => (
                          <div key={app.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <strong style={{ color: 'var(--text-primary)' }}>{app.applicantName}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.applicantRole}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontStyle: 'italic', fontSize: '0.8rem', lineHeight: '1.4' }}>
                              "{app.notes || 'No message provided'}"
                            </p>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => onRejectApp(app.id)} 
                                style={{ 
                                  background: 'transparent', 
                                  border: '1px solid var(--accent-rose, #f43f5e)', 
                                  color: 'var(--accent-rose, #f43f5e)', 
                                  padding: '4px 10px', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem', 
                                  cursor: 'pointer' 
                                }}
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => onAcceptApp(app.id)} 
                                style={{ 
                                  background: 'var(--primary)', 
                                  border: 'none', 
                                  color: 'white', 
                                  padding: '4px 10px', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem', 
                                  cursor: 'pointer' 
                                }}
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                You haven't created any projects yet.
              </p>
            )}
          </div>
        </section>

        <div>
          <section className="panel">
            <h2>Joined projects</h2>
            <div className="project-list compact">
              {joinedProjects.length > 0 ? (
                joinedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} compact />
                ))
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  You haven't joined any projects yet.
                </p>
              )}
            </div>
          </section>

          <section className="panel" style={{ marginTop: '24px' }}>
            <h2>My application progress</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {outgoingApps && outgoingApps.length > 0 ? (
                outgoingApps.map((app) => {
                  let statusColor = 'var(--text-muted)';
                  let statusBg = 'rgba(255, 255, 255, 0.05)';
                  if (app.status === 'Accepted') {
                    statusColor = 'var(--accent-emerald, #10b981)';
                    statusBg = 'rgba(16, 185, 129, 0.1)';
                  } else if (app.status === 'Rejected') {
                    statusColor = 'var(--accent-rose, #f43f5e)';
                    statusBg = 'rgba(244, 63, 94, 0.1)';
                  } else if (app.status === 'Pending') {
                    statusColor = 'var(--accent-amber, #f59e0b)';
                    statusBg = 'rgba(245, 158, 11, 0.1)';
                  }
                  
                  return (
                    <div key={app.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: '8px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{app.projectTitle}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        {app.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 0 0', fontStyle: 'italic', lineHeight: '1.4' }}>
                            Message: "{app.notes}"
                          </p>
                        )}
                      </div>
                      <span style={{ 
                        color: statusColor, 
                        backgroundColor: statusBg, 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        {app.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  You haven't applied to any projects yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default MyProjectsPage;
