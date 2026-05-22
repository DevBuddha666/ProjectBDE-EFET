import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (!result.error) {
        const user = result.payload.user;
        switch (user.role) {
          case 'ADMIN':
            navigate('/dashboard/admin');
            break;
          case 'RESPONSABLE':
            navigate('/dashboard/responsable');
            break;
          default:
            navigate('/dashboard/student');
        }
      }
    });
  };

  return (
    <>
      <div className="grid-background"></div>
      <Header />
      
      <main className="container" style={{ paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '24px', textAlign: 'center' }}>
            Connexion
          </h2>
          
          {error && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: '#ff6b6b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'var(--white)', marginBottom: '8px', fontSize: '0.875rem' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="neon-input"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'var(--white)', marginBottom: '8px', fontSize: '0.875rem' }}>
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="neon-input"
                required
              />
            </div>

            <button
              type="submit"
              className="neon-button"
              disabled={loading}
              style={{ width: '100%', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--blue-300)', fontSize: '0.875rem' }}>
              Comptes de démonstration:
            </p>
            <p style={{ color: 'var(--blue-400)', fontSize: '0.75rem', marginTop: '8px' }}>
              Admin: admin@efetmaroc.com / password123
            </p>
            <p style={{ color: 'var(--blue-400)', fontSize: '0.75rem' }}>
              Responsable: responsable@efetmaroc.com / password123
            </p>
            <p style={{ color: 'var(--blue-400)', fontSize: '0.75rem' }}>
              Étudiant: student1@efetmaroc.com / password123
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Login;
