import { useMemo, useState, useEffect } from 'react';
import './App.css';
import { developers, notifications, projects } from './data/mockData';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DevelopersPage from './pages/DevelopersPage';
import MyProjectsPage from './pages/MyProjectsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [savedProjects, setSavedProjects] = useState([3]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pm-theme') || 'dark';
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Live state lists
  const [projectsList, setProjectsList] = useState([]);
  const [developersList, setDevelopersList] = useState([]);
  const [myProjects, setMyProjects] = useState({ owned: [], joined: [] });
  const [activeDeveloperId, setActiveDeveloperId] = useState(null);

  // Validate active session with Spring BFF on load
  useEffect(() => {
    fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Fetch live lists on user context change
  useEffect(() => {
    if (user) {
      // Fetch active projects
      fetch('http://localhost:8080/api/projects', { credentials: 'include' })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setProjectsList(data))
        .catch(() => setProjectsList([]));

      // Fetch active developers
      fetch('http://localhost:8080/api/developers', { credentials: 'include' })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setDevelopersList(data))
        .catch(() => setDevelopersList([]));

      // Fetch user specific projects
      fetch('http://localhost:8080/api/projects/my', { credentials: 'include' })
        .then((res) => res.ok ? res.json() : { owned: [], joined: [] })
        .then((data) => setMyProjects(data))
        .catch(() => setMyProjects({ owned: [], joined: [] }));
    } else {
      setProjectsList([]);
      setDevelopersList([]);
      setMyProjects({ owned: [], joined: [] });
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pm-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
  };

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const searchText = `${project.title} ${project.description} ${project.stack.join(' ')}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projectsList, searchTerm, selectedStatus]);

  const authenticate = (event) => {
    event.preventDefault();
    setErrorMsg('');
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (authMode === 'login') {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            return fetch('http://localhost:8080/api/auth/me', { credentials: 'include' });
          }
          return res.json().then((err) => { throw new Error(err.error || 'Invalid credentials'); });
        })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to retrieve user profile');
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setActivePage('dashboard');
        })
        .catch((err) => {
          setErrorMsg(err.message);
        });
    } else {
      const name = formData.get('name');
      const role = formData.get('role');

      fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          skills: []
        })
      })
        .then((res) => {
          if (res.ok) {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('password', password);

            return fetch('http://localhost:8080/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params,
              credentials: 'include',
            });
          }
          return res.json().then((err) => { throw new Error(err.error || 'Signup failed'); });
        })
        .then((res) => {
          if (!res.ok) throw new Error('Signup succeeded, but auto-login failed');
          return fetch('http://localhost:8080/api/auth/me', { credentials: 'include' });
        })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to retrieve profile after auto-login');
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setActivePage('dashboard');
        })
        .catch((err) => {
          setErrorMsg(err.message);
        });
    }
  };

  const handleLogout = () => {
    fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .finally(() => {
        setUser(null);
        setActivePage('dashboard');
      });
  };

  const handleApplyProject = (projectId) => {
    fetch(`http://localhost:8080/api/projects/${projectId}/apply`, {
      method: 'POST',
      credentials: 'include'
    })
      .then((res) => {
        if (res.ok) {
          // Re-fetch projects to update collaboration status
          fetch('http://localhost:8080/api/projects', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setProjectsList(data));
            
          fetch('http://localhost:8080/api/projects/my', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setMyProjects(data));
            
          alert('Application submitted successfully!');
          return;
        }
        return res.json().then(err => { throw new Error(err.error || 'Failed to apply'); });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const toggleSaved = (projectId) => {
    setSavedProjects((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-primary, #0f0f11)', color: 'var(--text-primary, #f3f4f6)', gap: '16px' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', borderTopColor: 'var(--accent-color, #6366f1)', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={authenticate}
        theme={theme}
        onToggleTheme={toggleTheme}
        error={errorMsg}
      />
    );
  }

  const handleViewDeveloperProfile = (devId) => {
    setActiveDeveloperId(devId);
    setActivePage('profile');
  };

  return (
    <WorkspaceLayout
      activePage={activePage}
      user={user}
      onLogout={handleLogout}
      onPageChange={(page) => {
        setActiveDeveloperId(null);
        setActivePage(page);
      }}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {activePage === 'dashboard' && (
        <DashboardPage
          currentUser={user}
          projects={projectsList}
          developers={developersList}
          notifications={notifications}
          onPageChange={setActivePage}
          onViewProfile={handleViewDeveloperProfile}
        />
      )}
      {activePage === 'projects' && (
        <ProjectsPage
          projects={filteredProjects}
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          savedProjects={savedProjects}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
          onToggleSaved={toggleSaved}
          currentUser={user}
          onApply={handleApplyProject}
        />
      )}
      {activePage === 'developers' && (
        <DevelopersPage 
          developers={developersList} 
          onViewProfile={handleViewDeveloperProfile}
        />
      )}
      {activePage === 'profile' && (
        <ProfilePage
          currentUser={user}
          developerId={activeDeveloperId}
          onUpdateUser={setUser}
          onBack={() => setActivePage('developers')}
        />
      )}
      {activePage === 'my-projects' && (
        <MyProjectsPage
          ownedProjects={myProjects.owned}
          joinedProjects={myProjects.joined}
        />
      )}
      {activePage === 'notifications' && <NotificationsPage items={notifications} />}
      {activePage === 'settings' && <SettingsPage user={user} onUpdateUser={setUser} />}
    </WorkspaceLayout>
  );
}

export default App;
