import AuthProductPreview from '../components/AuthProductPreview';
import { SunIcon, MoonIcon } from '../components/Icons';
import Logo from '../components/Logo';

function AuthPage({ mode, onModeChange, onSubmit, theme, onToggleTheme }) {
  const isRegister = mode === 'register';

  return (
    <main className="auth-shell">
      <div className="auth-theme-toggle">
        <button className="theme-toggle-btn" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
      <section className="auth-story">
        <div className="brand-lockup" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={32} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>ProjectMate</span>
        </div>

        <div className="auth-copy">
          <p className="eyebrow">Developer collaboration portal</p>
          <h1>Build real projects with the right people.</h1>
          <p>
            ProjectMate helps developers discover serious project ideas, find
            collaborators by skill, and manage applications from one workspace.
          </p>
        </div>

        <AuthProductPreview />
      </section>

      <section className="auth-card" aria-label={isRegister ? 'Create account' : 'Log in'}>
        <p className="eyebrow">{isRegister ? 'Create account' : 'Welcome back'}</p>
        <h2>{isRegister ? 'Start your profile' : 'Log in to ProjectMate'}</h2>
        <p className="mock-note">Demo mode: use any valid email and password for now.</p>

        <form onSubmit={onSubmit}>
          {isRegister && (
            <label>
              Name
              <input type="text" placeholder="Rutika Patil" required />
            </label>
          )}
          <label>
            Email
            <input type="email" placeholder="rutika@example.com" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="Minimum 6 characters" minLength="6" required />
          </label>
          {isRegister && (
            <label>
              Primary role
              <select required defaultValue="">
                <option value="" disabled>Select your role</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>Designer</option>
              </select>
            </label>
          )}
          <button className="primary-action" type="submit">
            {isRegister ? 'Create account' : 'Continue'}
          </button>
        </form>

        <button className="ghost-action" type="button">
          Continue with GitHub
        </button>
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to ProjectMate?'}
          <button type="button" onClick={() => onModeChange(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Log in' : 'Create account'}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
