import React from 'react';

const MessageCard = ({ message, isOwn }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '12px'
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: '12px',
          background: isOwn ? 'var(--blue-500)' : 'rgba(13, 59, 110, 0.5)',
          border: isOwn ? '1px solid var(--blue-400)' : '1px solid var(--blue-500)'
        }}
      >
        {!isOwn && (
          <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
            {message.sender?.prenom} {message.sender?.nom}
          </p>
        )}
        <p style={{ color: 'var(--white)', fontSize: '0.875rem', margin: 0, lineHeight: '1.4' }}>
          {message.content}
        </p>
        <p style={{ color: 'var(--blue-300)', fontSize: '0.7rem', marginTop: '8px', margin: '8px 0 0 0' }}>
          {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
