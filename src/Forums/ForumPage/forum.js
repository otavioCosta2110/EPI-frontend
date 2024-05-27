import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./forum.css";

const ThreadDetail = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");

  const { id, title, description, username } = location.state;
  const apiURL = "http://localhost:3000";
  const thread = {
    id,
    title,
    description,
    username,
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.data);
    }
    const getPostsByThread = async () => {
      const response = await fetch(`${apiURL}/post/get/${thread.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const postsWithUsernames = await Promise.all(
        data.data.map(async (post) => {
          const responseGetUser = await fetch(
            `http://localhost:3000/user/getuserbyid?id=${post.user_id}`
          );
          const dataUser = await responseGetUser.json();
          return {
            ...post,
            userName: dataUser.data.name,
          };
        })
      );
      setPosts(postsWithUsernames);
    };

    getPostsByThread();
  }, [thread.id]);
  console.log(thread.id);

  const handleCreateResponse = async () => {
    const response = fetch(`${apiURL}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: thread.id,
        user_id: user.id,
        content: content,
      }),
    });
    if (response.ok) {
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setContent("");
    }
  };

  const handleDeletePost = async (postId) => {
    const response = await fetch(`${apiURL}/post/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
      }),
    });
    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  console.log(posts);

  return (
    <div className="thread-detail">
      <div>
        <h2>{username}</h2>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite sua resposta"
      />
      <button onClick={handleCreateResponse} className="create-response-button">
        Criar Comentário
      </button>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>
              <strong>{post.userName}</strong>
            </p>
            <p>{post.content}</p>
            {user.id === post.user_id && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="delete-post-button"
              >
                Apagar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreadDetail;
