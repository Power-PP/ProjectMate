function NotificationsPage({ items }) {
  return (
    <section className="page narrow">
      <div className="page-heading">
        <p className="eyebrow">Updates</p>
        <h1>Notifications</h1>
        <p>Application activity and project changes that need your attention.</p>
      </div>
      <section className="panel">
        <ul className="notification-list">
          {items.map((item) => (
            <li key={item}>
              <span className="status-dot"></span>
              <div>
                <strong>{item}</strong>
                <p>Just now</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default NotificationsPage;
