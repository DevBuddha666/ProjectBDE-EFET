import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vote } from '../features/votesSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VoteCard = ({ poll, canVote = true, showResults = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleVote = () => {
    if (selectedOptions.length > 0 && canVote) {
      dispatch(vote({ id: poll.id, optionIds: selectedOptions }));
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const hasVoted = poll.options?.some(opt => 
    opt.votes?.some(v => v.voterId === user?.id)
  );

  const isClosed = poll.status === 'CLOSED' || new Date() > new Date(poll.deadline);

  const chartData = poll.options?.map(option => ({
    name: option.candidate?.prenom || 'Inconnu',
    votes: option._count?.votes || 0
  })) || [];

  // Check if user's filiere matches poll's filiere
  const canUserVote = !poll.filiere || poll.filiere === user?.filiere;
  const filiereText = poll.filiere ? ` (Filière: ${poll.filiere})` : ' (Tous les candidats)';

  return (
    <div style={{
      padding: '0',
      marginBottom: '20px',
      borderRadius: '14px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9), rgba(0, 52, 165, 0.08))',
      border: '1px solid rgba(0, 217, 255, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(0, 82, 204, 0.12), rgba(0, 217, 255, 0.05))',
        borderBottom: '1px solid rgba(0, 217, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            color: 'var(--white-pure)',
            marginBottom: '6px',
            fontSize: '1.15rem',
            fontWeight: 700,
            letterSpacing: '0.2px'
          }}>{poll.title}</h3>
          {poll.description && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '8px', lineHeight: 1.5 }}>
              {poll.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📚 {poll.class?.name || 'Classe'}{filiereText}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📅 {new Date(poll.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <span style={{
          padding: '5px 14px',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          background: isClosed ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          color: isClosed ? '#f87171' : '#34d399',
          border: isClosed ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
          whiteSpace: 'nowrap',
          marginLeft: '12px'
        }}>
          {isClosed ? '● Fermé' : '● Actif'}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px 24px' }}>
        {!canUserVote && !showResults ? (
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            Ce vote est réservé à la filière {poll.filiere}. Vous ne pouvez pas voter.
          </div>
        ) : !showResults && !hasVoted && !isClosed && canVote && canUserVote ? (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '14px', fontSize: '0.9rem', fontWeight: 500 }}>
              Sélectionnez un ou plusieurs candidats :
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {poll.options?.map((option) => (
                <label
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: selectedOptions.includes(option.id) ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: selectedOptions.includes(option.id) ? '1px solid rgba(0, 217, 255, 0.35)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: selectedOptions.includes(option.id)
                      ? 'linear-gradient(135deg, var(--primary-blue), var(--secondary-cyan))'
                      : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--white-pure)',
                    flexShrink: 0,
                    transition: 'all 0.25s ease'
                  }}>
                    {(option.candidate?.prenom?.[0] || '?').toUpperCase()}
                  </div>
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    color: selectedOptions.includes(option.id) ? 'var(--white-pure)' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.9rem',
                    fontWeight: selectedOptions.includes(option.id) ? 600 : 400,
                    transition: 'all 0.25s ease'
                  }}>
                    {option.candidate?.prenom} {option.candidate?.nom}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={selectedOptions.length === 0}
              className="neon-button"
              style={{
                marginTop: '18px',
                padding: '12px 28px',
                fontWeight: 600,
                opacity: selectedOptions.length > 0 ? 1 : 0.4,
                background: selectedOptions.length > 0
                  ? 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light))'
                  : 'transparent',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                letterSpacing: '0.3px',
                transition: 'all 0.3s ease'
              }}
            >
              Voter ({selectedOptions.length} sélectionné{selectedOptions.length > 1 ? 's' : ''})
            </button>
          </div>
        ) : (
          <div>
            <p style={{
              color: hasVoted ? '#34d399' : isClosed ? '#f87171' : 'var(--secondary-cyan)',
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {hasVoted ? '✓ Vous avez déjà voté' : isClosed ? '✕ Le vote est fermé' : '📊 Résultats'}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 14, 39, 0.95)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'var(--white)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                />
                <Bar dataKey="votes" fill="url(#voteGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d9ff" />
                    <stop offset="100%" stopColor="#0052CC" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: 'rgba(0, 217, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 217, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                Total des votes
              </span>
              <span style={{ color: 'var(--secondary-cyan)', fontSize: '1rem', fontWeight: 700 }}>
                {poll._count?.votes || 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteCard;
