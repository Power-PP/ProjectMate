import React, { useState, useEffect } from 'react';
import { initials } from '../utils/format';

function ProfilePage({ currentUser, developerId, onUpdateUser, onBack }) {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    skills: '',
    bio: '',
    college: '',
    degree: '',
    fieldOfStudy: '',
    graduationYear: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const isOwnProfile = !developerId || developerId === currentUser.id;

  // Load profile user
  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(currentUser);
      setLoading(false);
    } else {
      setLoading(true);
      setError('');
      fetch(`http://localhost:8080/api/developers/${developerId}`, { credentials: 'include' })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to load developer profile');
        })
        .then((data) => {
          setProfileUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [developerId, currentUser, isOwnProfile]);

  // Load projects
  useEffect(() => {
    fetch('http://localhost:8080/api/projects', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjectsList(data))
      .catch(() => setProjectsList([]));
  }, []);

  // Prefill edit form
  useEffect(() => {
    if (profileUser) {
      const edu = profileUser.education || {};
      setEditForm({
        name: profileUser.name || '',
        role: profileUser.role || '',
        skills: profileUser.skills ? profileUser.skills.join(', ') : '',
        bio: profileUser.bio || '',
        college: edu.college || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        graduationYear: edu.graduationYear || '',
        githubUrl: profileUser.githubUrl || '',
        linkedinUrl: profileUser.linkedinUrl || '',
        portfolioUrl: profileUser.portfolioUrl || '',
      });
    }
  }, [profileUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const skillsArray = editForm.skills
      ? editForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    fetch('http://localhost:8080/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        role: editForm.role,
        skills: skillsArray,
        bio: editForm.bio,
        college: editForm.college,
        degree: editForm.degree,
        fieldOfStudy: editForm.fieldOfStudy,
        graduationYear: editForm.graduationYear,
        githubUrl: editForm.githubUrl,
        linkedinUrl: editForm.linkedinUrl,
        portfolioUrl: editForm.portfolioUrl,
      }),
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to update profile');
      })
      .then((updatedUser) => {
        onUpdateUser(updatedUser);
        setProfileUser(updatedUser);
        setIsEditing(false);
        setSaving(false);
      })
      .catch((err) => {
        setError(err.message);
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '16px' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', borderTopColor: 'var(--accent-color, #6366f1)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading developer profile...</p>
      </div>
    );
  }

  if (error && !profileUser) {
    return (
      <div className="page" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', maxWidth: '500px', margin: '40px auto' }}>
          <h3>Error loading profile</h3>
          <p>{error}</p>
          <button className="primary-action" onClick={onBack} style={{ marginTop: '16px' }}>Back to Search</button>
        </div>
      </div>
    );
  }

  const userEdu = profileUser.education || {};
  const userSkills = profileUser.skills || [];

  // Filter projects owned or joined by the profile user
  const ownedProjects = projectsList.filter((p) => p.ownerId === profileUser.id);
  const joinedProjects = projectsList.filter((p) => p.memberIds && p.memberIds.includes(profileUser.id));

  // Format socials link
  const getFullUrl = (url, type) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (type === 'github') return `https://github.com/${url}`;
    if (type === 'linkedin') return `https://linkedin.com/in/${url}`;
    return `https://${url}`;
  };

  return (
    <section className="page">
      <style>{`
        .profile-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 32px;
          margin-top: 24px;
        }
        @media (max-width: 900px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
        }
        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .profile-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .profile-card {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .profile-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 24px;
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--surface) 100%);
          position: relative;
          overflow: hidden;
        }
        .profile-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-brand);
        }
        .hero-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--gradient-brand);
          color: white;
          font-size: 2.2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md), 0 0 15px rgba(99, 102, 241, 0.3);
          margin-bottom: 16px;
        }
        .hero-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 6px 0;
          color: var(--text-primary);
        }
        .hero-role {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary);
          background: var(--primary-glow);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 20px;
        }
        .info-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
          margin: 0 0 16px 0;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        .info-item:last-child {
          margin-bottom: 0;
        }
        .info-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .info-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .info-value {
          color: var(--text-secondary);
        }
        .social-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          margin-bottom: 10px;
        }
        .social-link:last-child {
          margin-bottom: 0;
        }
        .social-link:hover {
          border-color: var(--primary);
          color: var(--text-primary);
          transform: translateY(-1px);
          background: var(--bg-tertiary);
        }
        .skill-badge {
          display: inline-block;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          margin: 0 8px 8px 0;
        }
        .bio-text {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          white-space: pre-line;
        }
        .project-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .project-list-item:last-child {
          border-bottom: none;
        }
        .project-meta-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .project-meta-title:hover {
          color: var(--primary);
        }
        .project-meta-stack {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .project-badge-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .status-open { background: rgba(6, 182, 212, 0.1); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.2); }
        .status-hiring { background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.2); }
        .status-progress { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.2); }
        .status-completed { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); }

        .profile-form label {
          display: block;
          margin-bottom: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .profile-form input,
        .profile-form select,
        .profile-form textarea {
          width: 100%;
          margin-top: 6px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 10px 12px;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: border var(--transition-fast);
        }
        .profile-form input:focus,
        .profile-form select:focus,
        .profile-form textarea:focus {
          border-color: var(--primary);
          outline: none;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        .button-group {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
      `}</style>

      {/* Page header and controls */}
      <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="eyebrow">{isOwnProfile ? 'Your Portal' : 'Developer Directory'}</p>
          <h1>{isOwnProfile ? 'My Portfolio' : `${profileUser.name}'s Profile`}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isOwnProfile && onBack && (
            <button className="secondary-action" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Search
            </button>
          )}
          {isOwnProfile && !isEditing && (
            <button className="primary-action" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', margin: '16px 0', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {isEditing ? (
        /* Edit Mode Form */
        <div className="profile-card">
          <form className="profile-form" onSubmit={handleSave}>
            <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Edit Portfolio details</h3>
            
            <div className="form-grid">
              <label>
                Full Name
                <input type="text" name="name" value={editForm.name} onChange={handleInputChange} required />
              </label>
              <label>
                Primary Role
                <input type="text" name="role" value={editForm.role} onChange={handleInputChange} required placeholder="e.g. Fullstack Developer" />
              </label>
            </div>

            <label>
              Short Bio / About Me
              <textarea name="bio" value={editForm.bio} onChange={handleInputChange} rows="4" placeholder="Share your experience, fields of interest, and what projects you want to work on." />
            </label>

            <label>
              Skills (comma separated)
              <input type="text" name="skills" value={editForm.skills} onChange={handleInputChange} placeholder="e.g. React, Spring Boot, MongoDB, Python" />
            </label>

            <div style={{ margin: '24px 0 16px 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Education & Academic Information</h4>
            </div>

            <div className="form-grid">
              <label>
                College / University
                <input type="text" name="college" value={editForm.college} onChange={handleInputChange} placeholder="e.g. Stanford University" />
              </label>
              <label>
                Degree
                <select name="degree" value={editForm.degree} onChange={handleInputChange}>
                  <option value="">Select Degree</option>
                  <option value="BTech">BTech (Bachelor of Technology)</option>
                  <option value="BSc">BSc (Bachelor of Science)</option>
                  <option value="BCS">BCS (Bachelor of Computer Science)</option>
                  <option value="BE">BE (Bachelor of Engineering)</option>
                  <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                  <option value="MCA">MCA (Master of Computer Applications)</option>
                  <option value="MSc">MSc (Master of Science)</option>
                  <option value="MS">MS (Master of Science - Postgrad)</option>
                  <option value="PhD">PhD (Doctor of Philosophy)</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label>
                Field of Study / Specialization
                <input type="text" name="fieldOfStudy" value={editForm.fieldOfStudy} onChange={handleInputChange} placeholder="e.g. Computer Science Engineering" />
              </label>
              <label>
                Graduation Year
                <input type="text" name="graduationYear" value={editForm.graduationYear} onChange={handleInputChange} placeholder="e.g. 2026 or 2028 (Expected)" />
              </label>
            </div>

            <div style={{ margin: '24px 0 16px 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Professional Links & Portfolios</h4>
            </div>

            <div className="form-grid">
              <label>
                GitHub Username / Link
                <input type="text" name="githubUrl" value={editForm.githubUrl} onChange={handleInputChange} placeholder="e.g. octocat" />
              </label>
              <label>
                LinkedIn Username / URL
                <input type="text" name="linkedinUrl" value={editForm.linkedinUrl} onChange={handleInputChange} placeholder="e.g. john-doe-123" />
              </label>
            </div>

            <label>
              Personal Website / Portfolio URL
              <input type="text" name="portfolioUrl" value={editForm.portfolioUrl} onChange={handleInputChange} placeholder="e.g. https://myportfolio.dev" />
            </label>

            <div className="button-group">
              <button className="secondary-action" type="button" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
              <button className="primary-action" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* View Profile Mode */
        <div className="profile-container">
          
          {/* Left Column: Sidebar Cards */}
          <div className="profile-sidebar">
            
            {/* Hero Card */}
            <div className="profile-card profile-hero">
              <div className="hero-avatar">{initials(profileUser.name)}</div>
              <h2 className="hero-name">{profileUser.name}</h2>
              <div className="hero-role">{profileUser.role || 'Developer'}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>ID: {profileUser.id}</p>
            </div>

            {/* Academic Card */}
            <div className="profile-card">
              <h3 className="info-title">Academic Credentials</h3>
              {userEdu.college ? (
                <>
                  <div className="info-item">
                    <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
                    <div>
                      <div className="info-label">College / University</div>
                      <div className="info-value">{userEdu.college}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <div>
                      <div className="info-label">Degree & Major</div>
                      <div className="info-value">{userEdu.degree} in {userEdu.fieldOfStudy || 'General'}</div>
                    </div>
                  </div>
                  {userEdu.graduationYear && (
                    <div className="info-item">
                      <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <div>
                        <div className="info-label">Graduation Year</div>
                        <div className="info-value">{userEdu.graduationYear}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>
                  No academic credentials listed yet.
                </div>
              )}
            </div>

            {/* Social Links Card */}
            <div className="profile-card">
              <h3 className="info-title">Social & Profiles</h3>
              
              {profileUser.githubUrl && (
                <a className="social-link" href={getFullUrl(profileUser.githubUrl, 'github')} target="_blank" rel="noopener noreferrer">
                  {/* GitHub Icon */}
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.436 22 12.017 22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Profile</span>
                </a>
              )}

              {profileUser.linkedinUrl && (
                <a className="social-link" href={getFullUrl(profileUser.linkedinUrl, 'linkedin')} target="_blank" rel="noopener noreferrer">
                  {/* LinkedIn Icon */}
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>
              )}

              {profileUser.portfolioUrl && (
                <a className="social-link" href={getFullUrl(profileUser.portfolioUrl, 'portfolio')} target="_blank" rel="noopener noreferrer">
                  {/* External Link Icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  <span>Personal Portfolio</span>
                </a>
              )}

              {!profileUser.githubUrl && !profileUser.linkedinUrl && !profileUser.portfolioUrl && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>
                  No portfolio links added.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Main Content */}
          <div className="profile-main">
            
            {/* About Me Card */}
            <div className="profile-card">
              <h3 className="info-title">About Me</h3>
              {profileUser.bio ? (
                <p className="bio-text">{profileUser.bio}</p>
              ) : (
                <p className="bio-text" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No biography provided yet. {isOwnProfile && 'Click "Edit Profile" to share your developer story.'}
                </p>
              )}
            </div>

            {/* Skills Card */}
            <div className="profile-card">
              <h3 className="info-title">Core Competencies & Stack</h3>
              {userSkills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {userSkills.map((skill) => (
                    <span className="skill-badge" key={skill}>{skill}</span>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  No skills listed yet.
                </div>
              )}
            </div>

            {/* Projects Grid */}
            <div className="profile-card" style={{ padding: 0 }}>
              <div style={{ padding: '24px 24px 8px 24px' }}>
                <h3 className="info-title" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>Projects & Collaborations</h3>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                {/* Owned Projects */}
                <div style={{ padding: '16px 24px 8px 24px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)' }}>Created Projects</h4>
                </div>
                {ownedProjects.length > 0 ? (
                  <div>
                    {ownedProjects.map((proj) => (
                      <div className="project-list-item" key={proj.id}>
                        <div>
                          <div className="project-meta-title">{proj.title}</div>
                          <div className="project-meta-stack">Stack: {proj.stack.join(', ')}</div>
                        </div>
                        <span className={`project-badge-status status-${proj.status.toLowerCase().replace(' ', '')}`}>
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '12px 24px 20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No created projects listed.
                  </div>
                )}

                {/* Joined Projects */}
                <div style={{ padding: '16px 24px 8px 24px', borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>Joined Projects</h4>
                </div>
                {joinedProjects.length > 0 ? (
                  <div>
                    {joinedProjects.map((proj) => (
                      <div className="project-list-item" key={proj.id}>
                        <div>
                          <div className="project-meta-title">{proj.title}</div>
                          <div className="project-meta-stack">Stack: {proj.stack.join(', ')}</div>
                        </div>
                        <span className={`project-badge-status status-${proj.status.toLowerCase().replace(' ', '')}`}>
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '12px 24px 24px 24px', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No joined projects listed.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </section>
  );
}

export default ProfilePage;
