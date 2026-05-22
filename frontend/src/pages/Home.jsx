import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/efet-logo.png';

// Gallery images
import dev1 from '../assets/gallery/developpement_1.jpg';
import dev2 from '../assets/gallery/developpement_2.jpg';
import acc1 from '../assets/gallery/accountability_1.jpg';
import acc2 from '../assets/gallery/accountability_2.jpg';
import fin1 from '../assets/gallery/finance_1.jpg';
import fin2 from '../assets/gallery/finance_2.jpg';

const Home = () => {
  return (
    <>
      <Header />

      <main className="container" style={{ paddingTop: '60px' }}>
        {/* Hero Section */}
        <section className="glass-card fade-in white-border" style={{
          padding: '100px 60px',
          textAlign: 'center',
          marginBottom: '80px',
          background: 'linear-gradient(135deg, rgba(5, 8, 16, 0.85), rgba(10, 14, 39, 0.95))',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15), transparent)',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            position: 'absolute',
            bottom: -50,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent)',
            pointerEvents: 'none'
          }}></div>

          <img src={logo} alt="EFET Maroc" style={{
            height: '140px',
            marginBottom: '32px',
            filter: 'drop-shadow(0 0 25px rgba(0, 217, 255, 0.5))',
            transition: 'filter var(--transition-normal)',
            animation: 'float 3s ease-in-out infinite'
          }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 35px rgba(0, 217, 255, 0.8))'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 25px rgba(0, 217, 255, 0.5))'}
          />

          <h1 style={{
            fontSize: '3.8rem',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--white-pure) 0%, var(--secondary-cyan) 50%, var(--primary-blue-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            letterSpacing: '-1px'
          }}>
            EFET Agadir
          </h1>

          <h2 style={{
            fontSize: '1.75rem',
            color: 'var(--white-pure)',
            marginBottom: '24px',
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}>
            Bureau des Étudiants
          </h2>

          <p style={{
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, var(--white) 0%, var(--secondary-cyan) 50%, var(--primary-blue-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '48px',
            fontWeight: 600,
            letterSpacing: '0.3px'
          }}>
            Votre avenir, notre mission.
          </p>

          <Link to="/login" className="neon-button hover-lift" style={{
            padding: '18px 40px',
            fontSize: '1.1rem',
            display: 'inline-block',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            Connexion
          </Link>
        </section>

        {/* History Section */}
        <section className="glass-card fade-in white-border" style={{
          padding: '80px 60px',
          marginBottom: '80px',
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.8), rgba(5, 8, 16, 0.9))',
          animation: 'slideInLeft 0.6s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '48px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--white-pure) 0%, var(--secondary-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Historique du Bureau des Étudiants
          </h2>

          <div style={{
            color: 'var(--white)',
            lineHeight: '2',
            fontSize: '1.05rem'
          }}>
            <p style={{
              marginBottom: '28px',
              color: 'var(--white)',
              transition: 'all var(--transition-normal)',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--secondary-cyan)';
                e.currentTarget.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.paddingLeft = '16px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.paddingLeft = '0px';
              }}
            >
              Le Bureau des Étudiants (BDE) de l'EFET Maroc est une organisation étudiante dynamique qui œuvre
              pour améliorer la vie étudiante et favoriser l'épanouissement de chaque stagiaire au sein de l'établissement.
            </p>

            <p style={{
              marginBottom: '28px',
              color: 'var(--white)',
              transition: 'all var(--transition-normal)',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--secondary-cyan)';
                e.currentTarget.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.paddingLeft = '16px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.paddingLeft = '0px';
              }}
            >
              Depuis sa création, le BDE a organisé de nombreux événements culturels, sportifs et professionnels,
              créant ainsi une communauté solide et unie. Notre mission est de représenter les étudiants,
              de défendre leurs intérêts et de leur offrir des opportunités uniques de développement personnel.
            </p>

            <p style={{
              color: 'var(--white)',
              transition: 'all var(--transition-normal)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--secondary-cyan)';
                e.currentTarget.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.paddingLeft = '16px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.paddingLeft = '0px';
              }}
            >
              Aujourd'hui, le BDE continue d'innover et de s'adapter aux besoins des étudiants,
              en proposant des activités variées et en maintenant un lien étroit avec l'administration de l'école.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="glass-card fade-in" style={{
          padding: '60px 50px',
          marginBottom: '60px',
          animation: 'slideInRight 0.6s ease-out',
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.8), rgba(5, 8, 16, 0.9))',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '16px',
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--white-pure) 0%, var(--secondary-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Galerie Photos
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'var(--white)',
            opacity: 0.6,
            marginBottom: '48px',
            fontSize: '1.05rem',
            letterSpacing: '0.3px'
          }}>
            Découvrez nos pôles d'activités à travers l'objectif
          </p>

          {/* Développement Category */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              paddingLeft: '16px',
              borderLeft: '3px solid #00d9ff',
              color: 'var(--white-pure)',
              letterSpacing: '0.5px'
            }}>
              Développement
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {[{ img: dev1, label: 'Collaboration & Innovation' }, { img: dev2, label: 'Travail d\'équipe' }].map((item, idx) => (
                <div
                  key={`dev-${idx}`}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    aspectRatio: '16/10',
                    cursor: 'pointer',
                    border: '1px solid rgba(0, 217, 255, 0.15)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.15)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '0.7';
                  }}
                >
                  <img src={item.img} alt={item.label} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} />
                  <div className="overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 20px 16px',
                    background: 'linear-gradient(transparent, rgba(5, 8, 16, 0.9))',
                    opacity: 0.7,
                    transition: 'opacity 0.4s ease'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0, 217, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#00d9ff',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(0, 217, 255, 0.3)'
                  }}>
                    Développement
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accountability Category */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              paddingLeft: '16px',
              borderLeft: '3px solid #a855f7',
              color: 'var(--white-pure)',
              letterSpacing: '0.5px'
            }}>
              Comptabilité
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {[{ img: acc1, label: 'Planification stratégique' }, { img: acc2, label: 'Suivi & évaluation' }].map((item, idx) => (
                <div
                  key={`acc-${idx}`}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    aspectRatio: '16/10',
                    cursor: 'pointer',
                    border: '1px solid rgba(168, 85, 247, 0.15)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.15)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '0.7';
                  }}
                >
                  <img src={item.img} alt={item.label} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} />
                  <div className="overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 20px 16px',
                    background: 'linear-gradient(transparent, rgba(5, 8, 16, 0.9))',
                    opacity: 0.7,
                    transition: 'opacity 0.4s ease'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#a855f7',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    Accountability
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Finance Category */}
          <div>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              paddingLeft: '16px',
              borderLeft: '3px solid #22c55e',
              color: 'var(--white-pure)',
              letterSpacing: '0.5px'
            }}>
              Finance
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {[{ img: fin1, label: 'Gestion budgétaire' }, { img: fin2, label: 'Analyse financière' }].map((item, idx) => (
                <div
                  key={`fin-${idx}`}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    aspectRatio: '16/10',
                    cursor: 'pointer',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.15)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '0.7';
                  }}
                >
                  <img src={item.img} alt={item.label} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} />
                  <div className="overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 20px 16px',
                    background: 'linear-gradient(transparent, rgba(5, 8, 16, 0.9))',
                    opacity: 0.7,
                    transition: 'opacity 0.4s ease'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#22c55e',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    Finance
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
