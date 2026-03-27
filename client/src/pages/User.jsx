import React from 'react';

const User = () => {
  return (
    <div style={styles.dashboard}>
      <h1>User Dashboard 👤</h1>
      <p>Welcome, User! You have limited access to the system.</p>
    </div>
  );
};

// Inline styles
const styles = {
  dashboard: { textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }
};

export default User;
