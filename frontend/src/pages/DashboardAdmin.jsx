import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingPosts, approvePost, rejectPost } from '../features/postsSlice';
import { fetchPolls, createPoll, closePoll, deletePoll } from '../features/votesSlice';
import { getDashboardStats, getAllUsers, createUser, updateUserRole, deleteUser, getAllClasses } from '../services/adminService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import VoteCard from '../components/VoteCard';

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pendingPosts, loading: postsLoading } = useSelector((state) => state.posts);
  const { polls, pollResults, loading: pollsLoading } = useSelector((state) => state.votes);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({ title: '', description: '', filiere: '', candidateIds: [], deadline: '' });
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', password: '', role: 'ETUDIANT', filiere: '', classId: '' });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadDashboardStats();
    dispatch(fetchPendingPosts());
    dispatch(fetchPolls());
    loadUsers();
  }, [dispatch]);

  // Load available candidates when filiere changes
  useEffect(() => {
    if (newPoll.filiere) {
      loadCandidates();
    } else {
      setAvailableCandidates([]);
    }
  }, [newPoll.filiere]);

  const loadDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await getAllUsers({ filiere: newPoll.filiere });
      setAvailableCandidates(response.data);
      // Reset selected candidates when filiere changes
      setNewPoll(prev => ({ ...prev, candidateIds: [] }));
    } catch (error) {
      console.error('Failed to load candidates:', error);
    }
  };

  const handleApprovePost = (postId) => {
    dispatch(approvePost({ id: postId, feedback: '' }));
  };

  const handleRejectPost = (postId, feedback) => {
    dispatch(rejectPost({ id: postId, feedback }));
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!newPoll.deadline) return;

    const formattedPoll = {
      ...newPoll,
      deadline: new Date(newPoll.deadline).toISOString()
    };

    dispatch(createPoll(formattedPoll)).then(() => {
      setShowCreatePoll(false);
      setNewPoll({ title: '', description: '', filiere: '', candidateIds: [], deadline: '' });
    });
  };

  const handleDeletePoll = (pollId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vote? Cette action est irréversible.')) {
      dispatch(deletePoll(pollId));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setShowCreateUser(false);
      setNewUser({ nom: '', prenom: '', email: '', password: '', role: 'ETUDIANT', filiere: '', classId: '' });
      loadUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      loadUsers();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <>
      <div className="grid-background"></div>
      <Header />
      
      <main className="container" style={{ paddingTop: '40px' }}>
        <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--accent)', marginBottom: '8px' }}>
            Tableau de bord Admin
          </h1>
          <p style={{ color: 'var(--blue-300)' }}>
            {user?.prenom} {user?.nom} • Administrateur
          </p>
        </div>

        <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className="neon-button"
              style={{
                background: activeTab === 'overview' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'overview' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className="neon-button"
              style={{
                background: activeTab === 'posts' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'posts' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Publications ({pendingPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className="neon-button"
              style={{
                background: activeTab === 'polls' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'polls' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Votes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="neon-button"
              style={{
                background: activeTab === 'users' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'users' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Utilisateurs
            </button>
          </div>
        </div>

        {activeTab === 'overview' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>{stats.totalStudents}</h3>
              <p style={{ color: 'var(--blue-300)' }}>Étudiants</p>
            </div>
            <div className="glass-card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>{stats.activePosts}</h3>
              <p style={{ color: 'var(--blue-300)' }}>Publications actives</p>
            </div>
            <div className="glass-card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>{stats.activePolls}</h3>
              <p style={{ color: 'var(--blue-300)' }}>Votes actifs</p>
            </div>
            <div className="glass-card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>{stats.pendingPosts}</h3>
              <p style={{ color: 'var(--blue-300)' }}>En attente</p>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Publications en attente d'approbation</h2>
            {postsLoading ? (
              <p style={{ color: 'var(--blue-300)' }}>Chargement...</p>
            ) : pendingPosts.length === 0 ? (
              <p style={{ color: 'var(--blue-300)' }}>Aucune publication en attente</p>
            ) : (
              pendingPosts.map((post) => (
                <div key={post.id} style={{ marginBottom: '16px' }}>
                  <PostCard post={post} canReact={false} canComment={false} />
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="neon-button"
                      style={{ background: 'var(--blue-500)', borderColor: 'var(--blue-400)' }}
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        const feedback = prompt('Raison du rejet:');
                        if (feedback) handleRejectPost(post.id, feedback);
                      }}
                      className="neon-button"
                      style={{ background: 'transparent', borderColor: 'var(--blue-500)' }}
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="fade-in" style={{ marginBottom: '24px' }}>
            {/* Votes Header */}
            <div className="glass-card" style={{
              padding: '32px 28px',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9), rgba(0, 82, 204, 0.15))',
              border: '1px solid rgba(0, 217, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 217, 255, 0.08), transparent)',
                pointerEvents: 'none'
              }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    background: 'linear-gradient(135deg, var(--white-pure) 0%, var(--secondary-cyan) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Gestion des votes</h2>
                  <p style={{ color: 'var(--secondary-cyan)', opacity: 0.6, fontSize: '0.9rem', letterSpacing: '0.3px' }}>
                    Élection du Responsable de Classe — Marketing Digital
                  </p>
                </div>
                <button
                  onClick={() => setShowCreatePoll(!showCreatePoll)}
                  className="neon-button"
                  style={{
                    padding: '12px 24px',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    background: showCreatePoll ? 'transparent' : 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light))',
                    border: showCreatePoll ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0, 217, 255, 0.3)',
                    color: showCreatePoll ? '#f87171' : 'var(--white-pure)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {showCreatePoll ? '✕ Annuler' : '＋ Créer un vote'}
                </button>
              </div>
            </div>

            {/* Create Poll Form */}
            {showCreatePoll && (
              <div className="glass-card" style={{
                padding: '28px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85), rgba(0, 52, 165, 0.12))',
                border: '1px solid rgba(0, 217, 255, 0.1)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <h3 style={{
                  color: 'var(--secondary-cyan)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
                }}>
                  Nouveau vote
                </h3>
                <form onSubmit={handleCreatePoll}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--secondary-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Titre du vote
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Élection délégué de classe"
                        value={newPoll.title}
                        onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                        className="neon-input"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--secondary-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Filière
                      </label>
                      <select
                        value={newPoll.filiere}
                        onChange={(e) => setNewPoll({ ...newPoll, filiere: e.target.value })}
                        className="neon-input"
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, rgba(0, 82, 204, 0.25), rgba(80, 82, 204, 0.15))',
                          color: '#ffffff',
                          fontWeight: '500',
                          fontSize: '0.95rem',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%2700d9ff%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          backgroundSize: '20px',
                          paddingRight: '40px',
                          border: '1.5px solid rgba(0, 217, 255, 0.4)'
                        }}
                      >
                        <option value="">Sélectionner une filière</option>
                        <option value="DI">DI</option>
                        <option value="CI">CI</option>
                        <option value="AGAC">AGAC</option>
                        <option value="FC">FC</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: 'var(--secondary-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Décrivez le vote en détail..."
                      value={newPoll.description}
                      onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                      className="neon-input"
                      style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  {/* Candidates Selection */}
                  {newPoll.filiere && (
                    <div style={{
                      marginBottom: '16px',
                      padding: '16px',
                      background: 'rgba(0, 82, 204, 0.08)',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 217, 255, 0.08)'
                    }}>
                      <label style={{ display: 'block', color: 'var(--secondary-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Candidats ({newPoll.candidateIds.length} sélectionné{newPoll.candidateIds.length > 1 ? 's' : ''})
                      </label>
                      {availableCandidates.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '0.9rem' }}>Aucun candidat trouvé pour cette filière</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }} className="scrollbar-thin">
                          {availableCandidates.map((candidate) => (
                            <label key={candidate.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              background: newPoll.candidateIds.includes(candidate.id) ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                              border: newPoll.candidateIds.includes(candidate.id) ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: 'var(--white)'
                            }}>
                              <input
                                type="checkbox"
                                checked={newPoll.candidateIds.includes(candidate.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewPoll(prev => ({
                                      ...prev,
                                      candidateIds: [...prev.candidateIds, candidate.id]
                                    }));
                                  } else {
                                    setNewPoll(prev => ({
                                      ...prev,
                                      candidateIds: prev.candidateIds.filter(id => id !== candidate.id)
                                    }));
                                  }
                                }}
                                style={{ accentColor: 'var(--secondary-cyan)', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.9rem' }}>{candidate.prenom} {candidate.nom}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--secondary-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Date limite
                    </label>
                    <input
                      type="datetime-local"
                      value={newPoll.deadline}
                      onChange={(e) => setNewPoll({ ...newPoll, deadline: e.target.value })}
                      className="neon-input"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="neon-button" style={{
                      padding: '12px 32px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light))',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      letterSpacing: '0.3px'
                    }}>
                      Créer le vote
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Polls List */}
            <div className="glass-card" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85), rgba(5, 8, 16, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {pollsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid rgba(0, 217, 255, 0.15)',
                    borderTopColor: 'var(--secondary-cyan)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 12px'
                  }}></div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Chargement des votes...</p>
                </div>
              ) : polls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.4 }}>🗳️</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>Aucun vote pour le moment</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', marginTop: '4px' }}>Créez votre premier vote avec le bouton ci-dessus</p>
                </div>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="scrollbar-thin">
                  {polls.map((poll, index) => (
                    <div key={poll.id} style={{
                      marginBottom: index < polls.length - 1 ? '16px' : 0,
                      position: 'relative'
                    }}>
                      <VoteCard poll={poll} canVote={false} showResults={true} />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {poll.status === 'ACTIVE' && (
                          <button
                            onClick={() => dispatch(closePoll(poll.id))}
                            className="neon-button"
                            style={{
                              padding: '8px 20px',
                              fontSize: '0.85rem',
                              background: 'transparent',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#f87171',
                              fontWeight: 600,
                              letterSpacing: '0.3px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                            }}
                          >
                            Fermer le vote
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePoll(poll.id)}
                          className="neon-button"
                          style={{
                            padding: '8px 20px',
                            fontSize: '0.85rem',
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#f87171',
                            fontWeight: 600,
                            letterSpacing: '0.3px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                          }}
                        >
                          Supprimer le vote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: 'var(--accent)' }}>Gestion des utilisateurs</h2>
              <button onClick={() => setShowCreateUser(!showCreateUser)} className="neon-button">
                {showCreateUser ? 'Annuler' : 'Créer un utilisateur'}
              </button>
            </div>

            {showCreateUser && (
              <form onSubmit={handleCreateUser} style={{ marginBottom: '24px', padding: '16px', background: 'rgba(13, 59, 110, 0.3)', borderRadius: '8px' }}>
                <input
                  type="text"
                  placeholder="Nom"
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={newUser.prenom}
                  onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                >
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="RESPONSABLE">Responsable</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <select
                  value={newUser.filiere}
                  onChange={(e) => setNewUser({ ...newUser, filiere: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                >
                  <option value="">Sélectionner une filière</option>
                  <option value="DI">DI</option>
                  <option value="CI">CI</option>
                  <option value="AGAC">AGAC</option>
                  <option value="FC">FC</option>
                </select>
                <select
                  value={newUser.classId}
                  onChange={(e) => setNewUser({ ...newUser, classId: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px', width: '100%' }}
                >
                  <option value="">Sélectionner une classe (optionnel)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.year})
                    </option>
                  ))}
                </select>
                <button type="submit" className="neon-button">Créer</button>
              </form>
            )}

            <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="scrollbar-thin">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--blue-500)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--accent)' }}>Nom</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--accent)' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--accent)' }}>Rôle</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--accent)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--blue-700)' }}>
                      <td style={{ padding: '12px', color: 'var(--white)' }}>{user.prenom} {user.nom}</td>
                      <td style={{ padding: '12px', color: 'var(--blue-300)' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="neon-input"
                          style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        >
                          <option value="ETUDIANT">Étudiant</option>
                          <option value="RESPONSABLE">Responsable</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #ff6b6b',
                            color: '#ff6b6b',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default DashboardAdmin;
