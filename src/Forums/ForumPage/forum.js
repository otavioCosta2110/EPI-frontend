import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./forum.css";
import Post from "../../Components/Post";

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

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditContent("");
    setEditPostId(null);
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
        <Post post={post} user={user}></Post>
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
