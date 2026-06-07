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
    setUser({
      name: authMode === 'register' ? 'Rutika Patil' : 'Rutika',
      role: 'Full Stack Developer',
      skills: ['React', 'Java', 'MongoDB'],
    });
    setActivePage('dashboard');
  };

  const toggleSaved = (projectId) => {
    setSavedProjects((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  };

  if (!user) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={authenticate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <WorkspaceLayout
      activePage={activePage}
      user={user}
      onLogout={() => setUser(null)}
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
      {activePage === 'settings' && <SettingsPage user={user} />}
    </WorkspaceLayout>
  );
}

export default App;
