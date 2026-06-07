import Logo from './Logo';

function Brand({ onClick }) {
  return (
    <button className="brand-button" type="button" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Logo size={28} />
      <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>ProjectMate</span>
    </button>
  );
}

export default Brand;
