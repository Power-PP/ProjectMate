import { useState } from 'react';

function SettingsPage({ user, onUpdateUser }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const role = formData.get('role');
    const skills = formData.get('skills')
      ? formData.get('skills').split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const college = formData.get('college');
    const degree = formData.get('degree');
    const fieldOfStudy = formData.get('fieldOfStudy');

    fetch('http://localhost:8080/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        role,
        skills,
        college,
        degree,
        fieldOfStudy
      }),
      credentials: 'include'
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to update profile');
      })
      .then((data) => {
        onUpdateUser(data);
        setMessage('Profile updated successfully!');
        setSaving(false);
      })
      .catch((err) => {
        setError(err.message);
        setSaving(false);
      });
  };

  const edu = user.education || {};

  return (
    <section className="page narrow">
      <div className="page-heading">
        <p className="eyebrow">Account</p>
        <h1>Settings</h1>
        <p>Manage your profile details and education credentials.</p>
      </div>

      {message && (
        <div style={{ color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '500', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Display name
          <input type="text" name="name" defaultValue={user.name} required />
        </label>
        <label>
          Role
          <input type="text" name="role" defaultValue={user.role} required />
        </label>
        <label>
          Skills (comma separated)
          <input type="text" name="skills" defaultValue={user.skills ? user.skills.join(', ') : ''} />
        </label>

        <div style={{ margin: '24px 0 16px 0', borderTop: '1px solid var(--border-color, #27272a)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>Education Details</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Provide your college and academic specialization.</p>
        </div>

        <label>
          College / University
          <input type="text" name="college" defaultValue={edu.college || ''} placeholder="e.g. Stanford University" />
        </label>

        <label>
          Degree
          <select name="degree" defaultValue={edu.degree || ''}>
            <option value="">Select your degree</option>
            <option value="BTech">BTech (Bachelor of Technology)</option>
            <option value="BSc">BSc (Bachelor of Science)</option>
            <option value="BCS">BCS (Bachelor of Computer Science)</option>
            <option value="BE">BE (Bachelor of Engineering)</option>
            <option value="BCA">BCA (Bachelor of Computer Applications)</option>
            <option value="MCA">MCA (Master of Computer Applications)</option>
            <option value="MSc">MSc (Master of Science)</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Field of Study / Specialization
          <input type="text" name="fieldOfStudy" defaultValue={edu.fieldOfStudy || ''} placeholder="e.g. Computer Science Engineering" />
        </label>

        <button className="primary-action" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </section>
  );
}

export default SettingsPage;
