import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import logo from '../assets/efet-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'RESPONSABLE':
        return '/dashboard/responsable';
      default:
        return '/dashboard/student';
    }
  };

  return (
    <header className="glass-card white-border" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '0 20px',
      marginTop: '20px',
      borderRadius: '20px',
      backdropFilter: 'blur(20px)',
      background: 'rgba(10, 14, 39, 0.85)'
    }}>
      <Link to="/" className="hover-lift" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        textDecoration: 'none'
      }}>
        <img src={logo} alt="EFET Maroc" style={{ 
          height: '60px',
          filter: 'drop-shadow(0 0 15px rgba(0, 217, 255, 0.4))',
          transition: 'filter var(--transition-normal)'
        }} 
        onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 25px rgba(0, 217, 255, 0.7))'}
        onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(0, 217, 255, 0.4))'}
        />
        <div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            margin: 0, 
            background: 'linear-gradient(135deg, var(--white-pure) 0%, var(--secondary-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all var(--transition-normal)'
          }}>
            EFET Agadir
          </h1>
          <p style={{ 
            fontSize: '0.8rem', 
            margin: 0, 
            color: 'var(--gray-light)',
            fontWeight: 500,
            letterSpacing: '0.5px',
            transition: 'color var(--transition-normal)'
          }}>
            Bureau des Étudiants
          </p>
        </div>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {isAuthenticated ? (
          <>
            <Link to={getDashboardPath()} className="link-cyan" style={{ 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              Tableau de bord
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ 
                  fontSize: '0.9rem', 
                  margin: 0, 
                  color: 'var(--white-pure)',
                  fontWeight: 600,
                  transition: 'all var(--transition-normal)'
                }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--primary-blue), var(--secondary-purple))',
                  color: 'var(--white-pure)',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  display: 'inline-block',
                  marginTop: '4px',
                  transition: 'all var(--transition-normal)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(157, 78, 221, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="neon-button hover-lift"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="neon-button hover-lift" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Connexion
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
