import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import "./forum.css";

Modal.setAppElement("#root");

const ThreadDetail = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      const sortedPosts = postsWithUsernames.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setPosts(sortedPosts);
    };

    getPostsByThread();
  }, [thread.id]);

  const handleCreateResponse = async () => {
    const response = await fetch(`${apiURL}/post/create`, {
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
      setPosts([{ ...newPost.data, userName: user.name }, ...posts]);
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

  const handleEditPost = async () => {
    const response = await fetch(`${apiURL}/post/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: editPostId,
        content: editContent,
      }),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(
        posts.map((post) =>
          post.id === editPostId
            ? { ...updatedPost.data, userName: post.userName }
            : post
        )
      );
      setIsModalOpen(false);
    }
  };

  const openEditModal = (post) => {
    setEditContent(post.content);
    setEditPostId(post.id);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditContent("");
    setEditPostId(null);
  };

  return (
    <div className="thread-detail">
      <div>
        <h2>{username}</h2>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {user && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua resposta"
        />
      )}
      {user && (
        <button
          onClick={handleCreateResponse}
          className="create-response-button"
        >
          Criar Comentário
        </button>
      )}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>
              <strong>{post.userName}</strong>
            </p>
            <p>{post.content}</p>
            <div className="post-actions">
              {user.id === post.user_id && (
                <>
                  <button
                    onClick={() => openEditModal(post)}
                    className="edit-post-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="delete-post-button"
                  >
                    Apagar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Post"
        className="modal-forum"
        overlayClassName="overlay"
      >
        <h2>Editar Post</h2>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Edite seu comentário"
        />
        <button onClick={handleEditPost} className="save-edit-button">
          Salvar
        </button>
        <button onClick={closeEditModal} className="cancel-edit-button">
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default ThreadDetail;
