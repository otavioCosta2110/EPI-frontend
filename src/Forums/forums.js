import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
} from "react-router-dom";
import Modal from "react-modal";
import "./forums.css";

const Thread = ({ id, title, description, username }) => (
  console.log(username),
  (
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
    </div>
  )
);

const ThreadList = ({ threads, loggedInUser }) => (
  <div className="thread-list">
    {threads.map((thread) => (
      <Thread
        key={thread.id}
        id={thread.id}
        title={thread.title}
        description={thread.description}
        username={thread.userName}
      />
    ))}
  </div>
);

const NewThreadForm = ({ onCreateThread, user }) => {
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
    const createdAt = new Date().toISOString(); // Add current date
    const response = await fetch(`${apiURL}/thread/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, user_id: userId, createdAt }),
    });

    if (response.ok) {
      const newThread = await response.json();
      onCreateThread({
        title,
        description,
        user_id: userId,
        createdAt: newThread.createdAt,
      });
      setTitle("");
      setDescription("");
      setError("");
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
        <button type="submit">Criar Tópico</button>
      </form>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState("");
  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("User:", storedUser);
      setUser(JSON.parse(storedUser));
    }
    getThreads();
    console.log(user);
  }, []);

  const getThreads = async () => {
    const response = await fetch("http://localhost:3000/thread/get");
    const threadData = await response.json();
    console.log(threadData);
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
    console.log(sortedThreads);
  };

  const handleCreateThread = (newThread) => {
    setThreads([newThread, ...threads]); // add newThread to the beginning of the array
    setShowForm(false);
  };

  return (
    <div className="app">
      {user && user.data && user.data.id && (
        <div className="create-thread-container">
          <button onClick={() => setShowForm(true)}>Criar uma tópico</button>
        </div>
      )}
      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Criar Nova Thread"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <NewThreadForm onCreateThread={handleCreateThread} user={user} />
      </Modal>
      <ThreadList threads={threads} user={user} />
    </div>
  );
};

export default App;
