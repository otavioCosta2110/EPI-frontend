import React from 'react';
import { useParams } from 'react-router-dom';
import './forum.css';

const ThreadDetail = ({ location }) => {
  const { id } = useParams();
  const thread = {
    id,
    title: `Thread ${id}`,
    content: `Conteúdo detalhado da thread ${id}`
  };

  return (
    <div className="thread-detail">
      <h2>{thread.title}</h2>
      <p>{thread.content}</p>
    </div>
  );
};

export default ThreadDetail;
