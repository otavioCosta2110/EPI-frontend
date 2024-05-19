import React from "react";
import { useLocation } from "react-router-dom";
import "./forum.css";

const ThreadDetail = () => {
  const location = useLocation();

  const { id, title, description, username } = location.state;
  const apiURL = "http://localhost:3001";
  const thread = {
    id,
    title,
    description,
    username,
  };

  const handleCreateResponse = () => {
    const response = fetch(`${apiURL}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ thread_id: id, user_id: 1 }),
    });
  };

  return (
    <div className="thread-detail">
      <h2>{thread.username}</h2>
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <button onClick={handleCreateResponse} className="create-response-button">
        Create Response
      </button>
    </div>
  );
};

export default ThreadDetail;
