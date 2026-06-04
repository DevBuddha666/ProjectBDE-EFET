import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPendingPosts, fetchMyPosts, createPost } from '../features/postsSlice';
import { fetchPolls } from '../features/votesSlice';
import { fetchMessages, sendMessage } from '../features/messagesSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import VoteCard from '../components/VoteCard';
import MessageCard from '../components/MessageCard';

const DashboardResponsable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, pendingPosts, myPosts, loading: postsLoading } = useSelector((state) => state.posts);
  const { polls, loading: pollsLoading } = useSelector((state) => state.votes);
  const { messages, currentThread } = useSelector((state) => state.messages);
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPendingPosts());
    dispatch(fetchMyPosts());
    dispatch(fetchPolls(user?.classId));
    dispatch(fetchMessages());
  }, [dispatch, user?.classId]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    dispatch(createPost(newPost)).then(() => {
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', imageUrl: '' });
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (selectedUser && newMessage.trim()) {
      dispatch(sendMessage({ receiverId: selectedUser, content: newMessage, classId: user?.classId }));
      setNewMessage('');
    }
  };

  const students = posts?.filter(p => p.author?.role === 'ETUDIANT').map(p => p.author).filter(Boolean) || [];

  return (
    <>
      <div className="grid-background"></div>
      <Header />
      
      <main className="container" style={{ paddingTop: '40px' }}>
        <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--accent)', marginBottom: '8px' }}>
            Bienvenue, {user?.prenom} {user?.nom}
          </h1>
          <p style={{ color: 'var(--blue-300)' }}>
            Responsable de Classe • {user?.class?.name}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('posts')}
              className="neon-button"
              style={{
                background: activeTab === 'posts' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'posts' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Publications
            </button>
            <button
              onClick={() => setActiveTab('myPosts')}
              className="neon-button"
              style={{
                background: activeTab === 'myPosts' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'myPosts' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Mes Publications ({myPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('votes')}
              className="neon-button"
              style={{
                background: activeTab === 'votes' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'votes' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Votes
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className="neon-button"
              style={{
                background: activeTab === 'messages' ? 'var(--blue-500)' : 'transparent',
                border: activeTab === 'messages' ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
              }}
            >
              Messages
            </button>
          </div>
        </div>

        {activeTab === 'posts' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: 'var(--accent)' }}>Publications</h2>
              <button onClick={() => setShowCreatePost(!showCreatePost)} className="neon-button">
                {showCreatePost ? 'Annuler' : 'Créer une publication'}
              </button>
            </div>

            {showCreatePost && (
              <form onSubmit={handleCreatePost} style={{ marginBottom: '24px', padding: '16px', background: 'rgba(13, 59, 110, 0.3)', borderRadius: '8px' }}>
                <input
                  type="text"
                  placeholder="Titre"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                  required
                />
                <textarea
                  placeholder="Contenu"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px', minHeight: '100px', resize: 'vertical' }}
                  required
                />
                <input
                  type="text"
                  placeholder="URL de l'image (optionnel)"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                  className="neon-input"
                  style={{ marginBottom: '12px' }}
                />
                <button type="submit" className="neon-button">Publier</button>
              </form>
            )}

            {postsLoading ? (
              <p style={{ color: 'var(--blue-300)' }}>Chargement...</p>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="scrollbar-thin">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} canReact={true} canComment={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Publications en attente</h2>
            {pendingPosts.length === 0 ? (
              <p style={{ color: 'var(--blue-300)' }}>Aucune publication en attente</p>
            ) : (
              pendingPosts.map((post) => (
                <PostCard key={post.id} post={post} canReact={false} canComment={false} />
              ))
            )}
          </div>
        )}

        {activeTab === 'myPosts' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Mes Publications</h2>
            {myPosts.length === 0 ? (
              <p style={{ color: 'var(--blue-300)' }}>Vous n'avez pas encore soumis de publication</p>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="scrollbar-thin">
                {myPosts.map((post) => (
                  <div key={post.id} style={{ marginBottom: '16px', padding: '16px', background: 'rgba(13, 59, 110, 0.3)', borderRadius: '8px', border: `1px solid ${post.status === 'PENDING' ? 'var(--yellow-500)' : post.status === 'APPROVED' ? 'var(--green-500)' : 'var(--red-500)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ color: 'var(--white)', margin: '0 0 4px 0' }}>{post.title}</h3>
                        <p style={{ color: 'var(--blue-300)', margin: '0', fontSize: '0.875rem' }}>
                          {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: post.status === 'PENDING' ? 'rgba(255, 193, 7, 0.2)' : post.status === 'APPROVED' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        color: post.status === 'PENDING' ? 'var(--yellow-500)' : post.status === 'APPROVED' ? 'var(--green-500)' : 'var(--red-500)'
                      }}>
                        {post.status === 'PENDING' ? 'En attente' : post.status === 'APPROVED' ? 'Approuvé' : 'Rejeté'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--white)', margin: '0 0 8px 0' }}>{post.content.substring(0, 150)}...</p>
                    {post.feedback && (
                      <div style={{ padding: '8px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', marginTop: '8px' }}>
                        <p style={{ color: 'var(--yellow-500)', margin: '0', fontSize: '0.875rem' }}>
                          <strong>Commentaire admin:</strong> {post.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Votes Actifs</h2>
            {pollsLoading ? (
              <p style={{ color: 'var(--blue-300)' }}>Chargement...</p>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="scrollbar-thin">
                {polls.filter(p => p.status === 'ACTIVE').map((poll) => (
                  <VoteCard key={poll.id} poll={poll} canVote={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Messages</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <h3 style={{ color: 'var(--white)', marginBottom: '12px', fontSize: '1rem' }}>Étudiants</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="scrollbar-thin">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedUser(student.id)}
                      style={{
                        padding: '12px',
                        background: selectedUser === student.id ? 'var(--blue-700)' : 'rgba(13, 59, 110, 0.3)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        border: selectedUser === student.id ? '1px solid var(--accent)' : '1px solid var(--blue-500)'
                      }}
                    >
                      <p style={{ color: 'var(--white)', margin: 0, fontSize: '0.875rem' }}>
                        {student.prenom} {student.nom}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {selectedUser ? (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }} className="scrollbar-thin">
                      {currentThread.map((message) => (
                        <MessageCard
                          key={message.id}
                          message={message}
                          isOwn={message.senderId === user?.id}
                        />
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        className="neon-input"
                      />
                    </form>
                  </>
                ) : (
                  <p style={{ color: 'var(--blue-300)' }}>Sélectionnez un étudiant pour discuter</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default DashboardResponsable;
