import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reactToPost, addComment } from '../features/postsSlice';

const PostCard = ({ post, canReact = true, canComment = true }) => {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleReact = (type) => {
    if (canReact) {
      dispatch(reactToPost({ id: post.id, type }));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim() && canComment) {
      dispatch(addComment({ id: post.id, content: commentText }));
      setCommentText('');
    }
  };

  const getReactionCount = (type) => {
    return post.reactions?.filter(r => r.type === type).length || 0;
  };

  return (
    <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--accent)', marginBottom: '8px' }}>{post.title}</h3>
          <p style={{ color: 'var(--blue-300)', fontSize: '0.875rem' }}>
            Par {post.author?.prenom} {post.author?.nom} • {new Date(post.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        {post.status === 'PENDING' && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '4px',
            background: 'var(--blue-700)',
            color: 'var(--white)',
            fontSize: '0.75rem'
          }}>
            En attente
          </span>
        )}
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
        />
      )}

      <p style={{ color: 'var(--white)', lineHeight: '1.6', marginBottom: '16px' }}>
        {post.content}
      </p>

      {canReact && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <button
            onClick={() => handleReact('LIKE')}
            style={{
              background: 'transparent',
              border: '1px solid var(--blue-500)',
              color: 'var(--white)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.boxShadow = 'var(--neon-glow)'; }}
            onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; }}
          >
            👍 {getReactionCount('LIKE')}
          </button>
          <button
            onClick={() => handleReact('HEART')}
            style={{
              background: 'transparent',
              border: '1px solid var(--blue-500)',
              color: 'var(--white)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.boxShadow = 'var(--neon-glow)'; }}
            onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; }}
          >
            ❤️ {getReactionCount('HEART')}
          </button>
          <button
            onClick={() => handleReact('CLAP')}
            style={{
              background: 'transparent',
              border: '1px solid var(--blue-500)',
              color: 'var(--white)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.boxShadow = 'var(--neon-glow)'; }}
            onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; }}
          >
            👏 {getReactionCount('CLAP')}
          </button>
        </div>
      )}

      {canComment && (
        <>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--blue-300)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '12px'
            }}
          >
            {showComments ? 'Masquer' : 'Afficher'} les commentaires ({post.comments?.length || 0})
          </button>

          {showComments && (
            <div style={{ marginTop: '16px' }}>
              <form onSubmit={handleAddComment} style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="neon-input"
                  style={{ marginBottom: '8px' }}
                />
                <button type="submit" className="neon-button" style={{ padding: '8px 16px' }}>
                  Envoyer
                </button>
              </form>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="scrollbar-thin">
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      background: 'rgba(13, 59, 110, 0.3)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <p style={{ color: 'var(--accent)', fontSize: '0.875rem', marginBottom: '4px' }}>
                      {comment.user?.prenom} {comment.user?.nom}
                    </p>
                    <p style={{ color: 'var(--white)', fontSize: '0.875rem', margin: 0 }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostCard;
