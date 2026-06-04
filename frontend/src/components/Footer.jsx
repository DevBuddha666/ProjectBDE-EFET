import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-card" style={{
      padding: '50px 40px',
      margin: '60px 20px 20px',
      borderRadius: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(5, 8, 16, 0.8), rgba(10, 14, 39, 0.9))',
      borderTop: '1px solid rgba(0, 217, 255, 0.2)'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          background: 'linear-gradient(135deg, var(--secondary-cyan), var(--primary-blue-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          EFET Agadir
        </h3>
        <p style={{ 
          background: 'linear-gradient(135deg, var(--secondary-cyan), var(--gray-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '0.95rem',
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}>
          Votre avenir, notre mission.
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '32px', 
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        {[
          { name: 'Facebook', url: 'https://facebook.com' },
          { name: 'Instagram', url: 'https://instagram.com' },
          { name: 'YouTube', url: 'https://youtube.com' }
        ].map((social) => (
          <a 
            key={social.name}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'var(--secondary-cyan)',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all var(--transition-normal)',
              padding: '8px 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary-blue-light)';
              e.currentTarget.style.textShadow = 'var(--glow-secondary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--secondary-cyan)';
              e.currentTarget.style.textShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {social.name}
          </a>
        ))}
      </div>

      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)',
        marginBottom: '24px'
      }}></div>

      <p style={{ 
        color: 'var(--gray-medium)', 
        fontSize: '0.85rem', 
        margin: 0,
        letterSpacing: '0.3px'
      }}>
        © {new Date().getFullYear()} EFET Agadir - Bureau des Étudiants. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;