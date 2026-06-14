import React from 'react';

function NotificationsPage({ items, incomingApps = [], onAcceptApp, onRejectApp, onClearAll }) {

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const diffMs = new Date() - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <section className="page narrow">
      <div className="page-heading split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="eyebrow">Updates</p>
          <h1>Notifications</h1>
          <p>Application activity and project changes that need your attention.</p>
        </div>
        {items && items.length > 0 && (
          <button 
            className="secondary-action" 
            type="button" 
            onClick={onClearAll}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Clear All
          </button>
        )}
      </div>
      <section className="panel" style={{ padding: '8px 0' }}>
        {items && items.length > 0 ? (
          <ul className="notification-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.06))',
                  opacity: item.read ? 0.75 : 1,
                  background: item.read ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span
                  className="status-dot"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.read ? 'transparent' : 'var(--primary, #6366f1)',
                    border: item.read ? '1px solid var(--text-muted)' : 'none',
                    boxShadow: item.read ? 'none' : '0 0 8px var(--primary)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{
                    fontSize: '0.9rem',
                    color: item.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontWeight: item.read ? '500' : '600'
                  }}>
                    {item.message}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatTime(item.createdAt)}
                  </p>

                  {/* Inline application review panel */}
                  {(() => {
                    const matchingApp = incomingApps.find(app =>
                      app.projectId === item.projectId &&
                      app.applicantId === item.senderId &&
                      app.status === 'Pending'
                    );
                    if (matchingApp) {
                      return (
                        <div style={{ marginTop: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', width: '100%', maxWidth: '450px' }}>
                          {matchingApp.notes && (
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              Message: "{matchingApp.notes}"
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => onRejectApp(matchingApp.id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid var(--accent-rose, #f43f5e)',
                                color: 'var(--accent-rose, #f43f5e)',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => onAcceptApp(matchingApp.id)}
                              style={{
                                background: 'var(--primary)',
                                border: 'none',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>All caught up!</h3>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>No new updates or alerts.</p>
          </div>
        )}
      </section>
    </section>
  );
}

export default NotificationsPage;
