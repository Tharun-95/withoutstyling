import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user' // Default role
  });

  // State for error messages
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const { email, password, role } = formData;

    // Dummy Authentication Logic
    if (email === 'admin@test.com' && password === 'admin123' && role === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      navigate('/home'); // Redirect Admin
    } else if (email === 'user@test.com' && password === 'user123' && role === 'user') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'user');
      navigate('/home'); // Redirect User
    } else {
      // Invalid login
      setError('Invalid email, password, or role. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login to Portal</h2>

        {/* Display Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Login</button>
      </form>

      {/* Helper text for testing */}
      <div style={styles.hint}>
        <p><strong>Test Credentials:</strong></p>
        <p>User: user@test.com / user123</p>
        <p>Admin: admin@test.com / admin123</p>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', fontFamily: 'sans-serif' },
  form: { border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px', backgroundColor: '#f9f9f9' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' },
  hint: { marginTop: '20px', fontSize: '13px', color: '#666' }
};

export default Login;
