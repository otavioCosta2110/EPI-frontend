import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
} from "react-router-dom";
import Modal from "react-modal";
import { FaTrash } from "react-icons/fa";
import "./forums.css";

const Thread = ({
  id,
  title,
  description,
  username,
  user,
  onDelete,
  threadUserId,
}) => (
  <div className="thread">
    <div className="thread-username">Publicado por: {username}</div>
    <Link
      to={`/forums/${id}`}
      className="thread-link"
      state={{ id, title, description, username }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
    <br></br>
    {(user.data.role === "0" || user.data.id === threadUserId) && (
      <FaTrash onClick={() => onDelete(id)} className="delete-icon" />
    )}
  </div>
);

const ThreadList = ({ threads, user, onDelete }) => (
  <div className="thread-list">
    {threads.map((thread) => (
      <Thread
        key={thread.id}
        id={thread.id}
        title={thread.title}
        description={thread.description}
        username={thread.userName}
        user={user}
        onDelete={onDelete}
        threadUserId={thread.user_id}
      />
    ))}
  </div>
);

const NewThreadForm = ({ onCreateThread, user, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const apiURL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const userId = user.data.id;
    const createdAt = new Date().toISOString();
    const response = await fetch(`${apiURL}/thread/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        user_id: userId,
        createdAt,
      }),
    });

    if (response.ok) {
      const newThread = await response.json();
      onCreateThread({
        id: newThread.id,
        title,
        description,
        user_id: userId,
        userName: user.data.name,
        createdAt: newThread.createdAt,
      });
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } else {
      console.error("Erro ao criar thread");
    }
  };

  return (
    <div className="new-thread-form-container">
      <form className="new-thread-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-buttons">
          <button type="submit">Criar Tópico</button>
          <button type="button" onClick={onClose} className="close-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState("");
  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteThreadId, setDeleteThreadId] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    getThreads();
  }, []);

  const getThreads = async () => {
    const response = await fetch("http://localhost:3000/thread/get");
    const threadData = await response.json();
    for (const thread of threadData.data) {
      const responseGetUser = await fetch(
        `http://localhost:3000/user/getuserbyid?id=${thread.user_id}`
      );
      const dataUser = await responseGetUser.json();
      thread.userName = dataUser.data.name;
    }

    const sortedThreads = threadData.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setThreads(sortedThreads);
  };

  const handleCreateThread = (newThread) => {
    setThreads([newThread, ...threads]);
    setShowForm(false);
  };

  const handleDeleteThread = async () => {
    if (deleteThreadId) {
      const response = await fetch(`http://localhost:3000/thread/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteThreadId,
        }),
      });

      if (response.ok) {
        setThreads(threads.filter((thread) => thread.id !== deleteThreadId));
      } else {
        console.error("Erro ao apagar thread");
      }
    }
    setDeleteThreadId(null); 
  };

  return (
    <div className="app">
      {user && user.data && user.data.id && (
        <div className="create-thread-container">
          <button onClick={() => setShowForm(true)}>Criar um tópico</button>
        </div>
      )}
      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Criar Nova Thread"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <NewThreadForm
          onCreateThread={handleCreateThread}
          user={user}
          onClose={() => setShowForm(false)}
        />
      </Modal>
      <ThreadList
        threads={threads}
        user={user}
        onDelete={(id) => setDeleteThreadId(id)}
      />

      <Modal
        isOpen={!!deleteThreadId}
        onRequestClose={() => setDeleteThreadId(null)}
        contentLabel="Excluir Tópico"
        className="modal-delete"
        overlayClassName="modal-overlay"
      >
        <div className="modal-delete-content">
          <p>Tem certeza que deseja apagar?</p>
          <button onClick={handleDeleteThread}>Sim</button>
          <button onClick={() => setDeleteThreadId(null)}>Não</button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
