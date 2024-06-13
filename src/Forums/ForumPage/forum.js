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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [answerPostId, setAnswerPostId] = useState(null);

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

  const handleAnswerPost = async () => {
    const response = await fetch(`${apiURL}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: thread.id,
        user_id: user.id,
        content: answerContent,
        post_id: answerPostId,
      }),
    });
    if (response.ok) {
      const newPost = await response.json();
      setPosts([...posts, { ...newPost.data, userName: user.name }]);
      setAnswerContent("");
      setIsAnswerModalOpen(false);
    }
  };

  const handleDeletePost = async () => {
    if (deletePostId) {
      const response = await fetch(`${apiURL}/post/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deletePostId,
        }),
      });
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== deletePostId));
        setDeletePostId(null);
      }
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
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (post) => {
    setEditContent(post.content);
    setEditPostId(post.id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditContent("");
    setEditPostId(null);
  };

  const openAnswerModal = (post) => {
    setAnswerContent("");
    setAnswerPostId(post.id);
    setIsAnswerModalOpen(true);
  };

  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setAnswerContent("");
    setAnswerPostId(null);
  };

  const buildPostHierarchy = (posts) => {
    const postMap = {};
    const rootPosts = [];

    posts.forEach((post) => {
      post.responses = [];
      postMap[post.id] = post;
    });

    posts.forEach((post) => {
      if (post.post_id) {
        if (postMap[post.post_id]) {
          postMap[post.post_id].responses.push(post);
        }
      } else {
        rootPosts.push(post);
      }
    });

    return rootPosts;
  };

  const renderPosts = (posts) => {
    return posts.map((post) => (
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
                onClick={() => setDeletePostId(post.id)}
                className="delete-post-button"
              >
                Apagar
              </button>
            </>
          )}
          <button
            onClick={() => openAnswerModal(post)}
            className="edit-post-button"
          >
            Responder
          </button>
        </div>
        {post.responses && post.responses.length > 0 && (
          <div className="responses">{renderPosts(post.responses)}</div>
        )}
      </div>
    ));
  };

  const rootPosts = buildPostHierarchy(posts);

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
      <div className="posts">{renderPosts(rootPosts)}</div>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Post"
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
      <Modal
        isOpen={!!deletePostId}
        onRequestClose={() => setDeletePostId(null)}
        contentLabel="Excluir Comentário"
        className="modal-delete"
        overlayClassName="overlay"
      >
        <div className="modal-delete-content">
          <p>Tem certeza que deseja apagar?</p>
          <button onClick={handleDeletePost}>Sim</button>
          <button onClick={() => setDeletePostId(null)}>Não</button>
        </div>
      </Modal>
      <Modal
        isOpen={isAnswerModalOpen}
        onRequestClose={closeAnswerModal}
        contentLabel="Responder Post"
        className="modal-forum"
        overlayClassName="overlay"
      >
        <h2>Responder Post</h2>
        <textarea
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder="Digite sua resposta"
        />
        <button onClick={handleAnswerPost} className="save-edit-button">
          Responder
        </button>
        <button onClick={closeAnswerModal} className="cancel-edit-button">
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default ThreadDetail;
