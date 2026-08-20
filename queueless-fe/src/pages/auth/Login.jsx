import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../../api/authApi';
import { saveAuth } from '../../utils/auth';

import './Login.scss';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      saveAuth(data);

      if (data.role === 'CUSTOMER') {
        navigate('/businesses');
      } else if (data.role === 'BUSINESS') {
        navigate('/business/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">Q</div>

          <p className="login-card__eyebrow">QUEUELESS</p>

          <h1>Welcome back</h1>

          <p>Sign in to manage or join your queues.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-form__field">
            <div className="login-form__label-row">
              <label htmlFor="password">Password</label>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-form__error">{error}</div>}

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-form__spinner" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="login__register">
            <span>Don't have an account?</span>

            <button type="button" onClick={() => navigate('/register')}>
              Create an account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
