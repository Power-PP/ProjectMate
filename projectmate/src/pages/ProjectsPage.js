import { useState, useEffect } from 'react';
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
  currentUser,
  onApply,
  onReloadProjects,
  openCreateModal,
  setOpenCreateModal,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyProject, setApplyProject] = useState(null);
  const [applyNotes, setApplyNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roles: '',
    stack: '',
    openings: 1,
    remote: true,
    status: 'Open'
  });

  useEffect(() => {
    if (openCreateModal) {
      setIsModalOpen(true);
      if (setOpenCreateModal) {
        setOpenCreateModal(false);
      }
    }
  }, [openCreateModal, setOpenCreateModal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const rolesArray = formData.roles 
      ? formData.roles.split(',').map(r => r.trim()).filter(Boolean)
      : [];
    const stackArray = formData.stack
      ? formData.stack.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    fetch('http://localhost:8080/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        roles: rolesArray,
        stack: stackArray,
        openings: parseInt(formData.openings) || 1,
        remote: formData.remote,
        status: formData.status
      }),
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to create project');
      })
      .then(() => {
        setFormData({
          title: '',
          description: '',
          roles: '',
          stack: '',
          openings: 1,
          remote: true,
          status: 'Open'
        });
        setIsModalOpen(false);
        setSubmitting(false);
        if (onReloadProjects) {
          onReloadProjects();
        }
      })
      .catch(err => {
        setErrorMsg(err.message);
        setSubmitting(false);
      });
  };

  return (
    <section className="page">
      <div className="page-heading split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="eyebrow">Project discovery</p>
          <h1>Explore projects</h1>
          <p>Search by skill, role, status, and collaboration fit.</p>
        </div>
        <button 
          className="primary-action" 
          type="button" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Project
        </button>
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
              currentUser={currentUser}
              onApply={() => setApplyProject(project)}
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

      {/* Create Project Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Post a New Project</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Describe your project, specify requirements, and find matching collaborators.</p>
            
            {errorMsg && (
              <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '500' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Project Title
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. AI Code Review Buddy"
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Description
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  rows="4"
                  placeholder="What is this project about? Highlight the main problems you want to solve."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Roles (comma separated)
                  <input 
                    type="text" 
                    name="roles" 
                    value={formData.roles} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Backend, Frontend, Designer"
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Tech Stack (comma separated)
                  <input 
                    type="text" 
                    name="stack" 
                    value={formData.stack} 
                    onChange={handleInputChange} 
                    placeholder="e.g. React, Spring Boot, MongoDB"
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Openings Count
                  <input 
                    type="number" 
                    name="openings" 
                    min="1" 
                    value={formData.openings} 
                    onChange={handleInputChange} 
                    required 
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Status
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="Open">Open</option>
                    <option value="Hiring">Hiring</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
              </div>

              <label className="toggle-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  name="remote" 
                  checked={formData.remote} 
                  onChange={handleInputChange} 
                />
                This project is fully remote
              </label>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button 
                  className="secondary-action" 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  className="primary-action" 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? 'Publishing...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Notes Modal */}
      {applyProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={() => { setApplyProject(null); setApplyNotes(''); }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Apply to {applyProject.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Introduce yourself, highlight relevant skills, and describe why you are a great choice for this project.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onApply(applyProject.id, applyNotes);
              setApplyProject(null);
              setApplyNotes('');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Application Message / Cover Letter
                <textarea 
                  value={applyNotes} 
                  onChange={(e) => setApplyNotes(e.target.value)} 
                  required 
                  rows="5"
                  placeholder="e.g. I have 2 years of React experience and would love to help design and implement the dashboard views..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </label>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  className="secondary-action" 
                  type="button" 
                  onClick={() => { setApplyProject(null); setApplyNotes(''); }}
                >
                  Cancel
                </button>
                <button 
                  className="primary-action" 
                  type="submit"
                >
                  Send Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectsPage;
