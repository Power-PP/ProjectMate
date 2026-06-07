function SettingsPage({ user }) {
  return (
    <section className="page narrow">
      <div className="page-heading">
        <p className="eyebrow">Account</p>
        <h1>Settings</h1>
        <p>Manage your profile details before they sync with the Spring Boot API.</p>
      </div>
      <form className="settings-form">
        <label>
          Display name
          <input type="text" defaultValue={user.name} />
        </label>
        <label>
          Role
          <input type="text" defaultValue={user.role} />
        </label>
        <label>
          Skills
          <input type="text" defaultValue={user.skills.join(', ')} />
        </label>
        <button className="primary-action" type="button">Save profile</button>
      </form>
    </section>
  );
}

export default SettingsPage;
