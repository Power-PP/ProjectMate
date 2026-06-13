import AuthProductPreview from '../components/AuthProductPreview';
import { SunIcon, MoonIcon } from '../components/Icons';
import Logo from '../components/Logo';

function AuthPage({ mode, onModeChange, onSubmit, theme, onToggleTheme, error }) {
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
        {error && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', margin: '12px 0', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {isRegister && (
            <label>
              Name
              <input type="text" name="name" placeholder="Rutika Patil" required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" placeholder="rutika@example.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Minimum 6 characters" minLength="6" required />
          </label>
          {isRegister && (
            <label>
              Primary role
              <select name="role" required defaultValue="">
                <option value="" disabled>Select your role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Designer">Designer</option>
              </select>
            </label>
          )}
          <button className="primary-action" type="submit">
            {isRegister ? 'Create account' : 'Continue'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '16px' }}>
          <a href="http://localhost:8080/oauth2/authorization/github" className="ghost-action" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            Continue with GitHub
          </a>
          <a href="http://localhost:8080/oauth2/authorization/google" className="ghost-action" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            Continue with Google
          </a>
        </div>
        
        <p className="auth-switch" style={{ marginTop: '16px' }}>
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
