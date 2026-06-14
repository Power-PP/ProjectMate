import Brand from '../components/Brand';
import { navItems } from '../data/mockData';
import { initials } from '../utils/format';
import {
  DashboardIcon,
  ProjectsIcon,
  DevelopersIcon,
  MyProjectsIcon,
  NotificationsIcon,
  SettingsIcon,
  SearchIcon,
  LogoutIcon,
  BellIcon,
  SunIcon,
  MoonIcon
} from '../components/Icons';

const iconMap = {
  dashboard: DashboardIcon,
  projects: ProjectsIcon,
  developers: DevelopersIcon,
  'my-projects': MyProjectsIcon,
  notifications: NotificationsIcon,
  settings: SettingsIcon,
};

function WorkspaceLayout({ activePage, user, children, onLogout, onPageChange, theme, onToggleTheme, unreadNotificationsCount }) {
  // Filter navbar links to only show Projects, Developers, and My Projects
  const navbarLinks = navItems.filter((item) =>
    ['projects', 'developers', 'my-projects'].includes(item.id)
  );

  return (
    <div className="workspace-layout">
      <header className="navbar">
        <div className="navbar-container">
          <div className={activePage === 'dashboard' ? 'navbar-brand-wrapper active' : 'navbar-brand-wrapper'}>
            <Brand onClick={() => onPageChange('dashboard')} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="nav-links" aria-label="Desktop navigation">
            {navbarLinks.map((item) => {
              const IconComponent = iconMap[item.id];
              const isActive = activePage === item.id;
              return (
                <button
                  className={isActive ? 'nav-link-item active' : 'nav-link-item'}
                  key={item.id}
                  type="button"
                  onClick={() => onPageChange(item.id)}
                >
                  {IconComponent && <IconComponent size={14} style={{ marginRight: '6px' }} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="navbar-actions">
            <div className="global-search">
              <SearchIcon size={14} className="search-icon" />
              <input type="search" placeholder="Search..." aria-label="Search" />
              <span className="shortcut-tag">/</span>
            </div>

            <button
              className="theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            <button
              className={activePage === 'notifications' ? 'icon-button notification-btn active' : 'icon-button notification-btn'}
              type="button"
              onClick={() => onPageChange('notifications')}
              aria-label="Notifications"
              style={{ position: 'relative' }}
            >
              <BellIcon size={18} />
              {unreadNotificationsCount > 0 && (
                <span 
                  className="notification-badge"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--accent-rose, #f43f5e)',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '15px',
                    height: '15px',
                    boxShadow: '0 0 8px rgba(244, 63, 94, 0.5)'
                  }}
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile Navigation Trigger */}
            <button
              className={activePage === 'profile' ? 'profile-nav-trigger active' : 'profile-nav-trigger'}
              type="button"
              onClick={() => onPageChange('profile')}
              aria-label="Profile"
            >
              <div className="avatar small">{initials(user.name)}</div>
              <span className="user-name-text">{user.name}</span>
            </button>

            <button className="text-button logout-btn" type="button" onClick={onLogout} aria-label="Logout">
              <LogoutIcon size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="workspace-main">
        {children}
      </main>
    </div>
  );
}

export default WorkspaceLayout;
