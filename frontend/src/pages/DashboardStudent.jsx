import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../features/postsSlice';
import { fetchPolls } from '../features/votesSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import VoteCard from '../components/VoteCard';

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading: postsLoading } = useSelector((state) => state.posts);
  const { polls, loading: pollsLoading } = useSelector((state) => state.votes);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPolls(user?.classId));
  }, [dispatch, user?.classId]);

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
            Étudiant • {user?.class?.name}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Publications</h2>
            {postsLoading ? (
              <p style={{ color: 'var(--blue-300)' }}>Chargement...</p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="scrollbar-thin">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} canReact={true} canComment={true} />
                ))}
              </div>
            )}
          </div>

          <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Votes Actifs</h2>
            {pollsLoading ? (
              <p style={{ color: 'var(--blue-300)' }}>Chargement...</p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="scrollbar-thin">
                {polls.filter(p => p.status === 'ACTIVE').map((poll) => (
                  <VoteCard key={poll.id} poll={poll} canVote={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DashboardStudent;
