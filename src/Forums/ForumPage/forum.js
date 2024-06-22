import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import PostVote from "../../Components/PostVote";
import "./forum.css";

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
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

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
        setConfirmDeleteModalOpen(false);
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
        <div className="post-header">
          <p>
            <strong>{post.userName}</strong>
          </p>
          <PostVote
            postId={post.id}
            initialVotes={post.votes}
            userId={user.id}
          />
        </div>
        <p>{post.content}</p>

        <div className="post-actions">
          {user.id === post.user_id && (
            <>
              <IconButton onClick={() => openEditModal(post)} aria-label="edit">
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDeletePostId(post.id);
                  setConfirmDeleteModalOpen(true);
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          <IconButton onClick={() => openAnswerModal(post)} aria-label="reply">
            <ReplyIcon />
          </IconButton>
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
        open={isEditModalOpen}
        onClose={closeEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-forum modal-container">
          <Typography variant="h6" component="h2">
            Editar Post
          </Typography>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edite seu comentário"
          />
          <Button onClick={handleEditPost} variant="contained" color="primary">
            Salvar
          </Button>
          <Button
            onClick={closeEditModal}
            variant="contained"
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
      <Modal
        open={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-forum modal-container">
          <Typography variant="h6" component="h2">
            Confirmar Exclusão
          </Typography>
          <Typography>Tem certeza que deseja apagar este tópico?</Typography>
          <Button
            onClick={handleDeletePost}
            variant="contained"
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            Confirmar
          </Button>
          <Button
            onClick={() => setConfirmDeleteModalOpen(false)}
            variant="contained"
            style={{ backgroundColor: "#074b94", color: "#fff" }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isAnswerModalOpen}
        onClose={closeAnswerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-forum modal-container">
          <Typography variant="h6" component="h2">
            Responder ao Comentário
          </Typography>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Digite sua resposta"
          />
          <Button
            onClick={handleAnswerPost}
            variant="contained"
            color="primary"
          >
            Responder
          </Button>
          <Button
            onClick={closeAnswerModal}
            variant="contained"
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ThreadDetail;
