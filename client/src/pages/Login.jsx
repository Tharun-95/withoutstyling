import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const { email, password, role } = formData;

    if (email === 'admin@test.com' && password === 'admin123' && role === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      navigate('/home');
    } else if (email === 'user@test.com' && password === 'user123' && role === 'user') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'user');
      navigate('/home');
    } else {
      setError('Invalid email, password, or role. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        .login-page-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .login-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 420px;
        }

        .login-title {
          margin: 0 0 28px;
          font-size: 28px;
          color: #1e293b;
          text-align: center;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .error-alert {
          background-color: #fee2e2;
          border: 1px solid #f87171;
          color: #991b1b;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-size: 14px;
          text-align: center;
          font-weight: 600;
        }

        .input-group {
          margin-bottom: 22px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background-color: #f8fafc;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 6px 15px rgba(118, 75, 162, 0.25);
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #5a6fd1 0%, #684290 100%);
          box-shadow: 0 8px 20px rgba(118, 75, 162, 0.4);
          transform: translateY(-2px);
        }

        .submit-btn:active {
          transform: translateY(1px);
          box-shadow: 0 3px 10px rgba(118, 75, 162, 0.3);
        }

        .test-credentials {
          margin-top: 30px;
          background-color: #f8fafc;
          border-radius: 10px;
          padding: 16px;
          font-size: 13px;
          color: #64748b;
          text-align: center;
          border: 1px solid #f1f5f9;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
            border-radius: 16px;
          }
          .login-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="login-page-wrapper">
        <div className="login-card">
          <form onSubmit={handleLogin}>
            <h2 className="login-title">Welcome Back</h2>

            {error && <div className="error-alert">{error}</div>}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Role</label>
              <select
                className="form-input"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" onClick={handleLogin}>Login</button>
          </form>

          <div className="test-credentials">
            <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#475569' }}>Test Credentials:</p>
            <p style={{ margin: '0 0 4px' }}><strong>User:</strong> user@test.com / user123</p>
            <p style={{ margin: '0' }}><strong>Admin:</strong> admin@test.com / admin123</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
