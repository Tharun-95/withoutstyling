import React from 'react';

const Admin = () => {
  return (
    <div style={styles.dashboard}>
      <h1>Admin Dashboard 🛡️</h1>
      <p>Welcome, Admin! You have full system access and elevated privileges.</p>
    </div>
  );
};

// Inline styles
const styles = {
  dashboard: { textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }
};

export default Admin;
