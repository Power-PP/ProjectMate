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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pm-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchText = `${project.title} ${project.description} ${project.stack.join(' ')}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

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

  return (
    <WorkspaceLayout
      activePage={activePage}
      user={user}
      onLogout={handleLogout}
      onPageChange={setActivePage}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {activePage === 'dashboard' && (
        <DashboardPage
          projects={projects}
          developers={developers}
          notifications={notifications}
          onPageChange={setActivePage}
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
        />
      )}
      {activePage === 'developers' && <DevelopersPage developers={developers} />}
      {activePage === 'my-projects' && (
        <MyProjectsPage
          ownedProjects={projects.slice(0, 2)}
          joinedProjects={projects.slice(2)}
        />
      )}
      {activePage === 'notifications' && <NotificationsPage items={notifications} />}
      {activePage === 'settings' && <SettingsPage user={user} onUpdateUser={setUser} />}
    </WorkspaceLayout>
  );
}

export default App;
