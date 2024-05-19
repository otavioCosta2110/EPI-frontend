import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
} from "react-router-dom";
import "./forums.css";

const Thread = ({ id, title, description, username }) => (
  <div className="thread">
    <div className="thread-username">{username}</div>
    <Link to={`/forums/${id}`} className="thread-link">
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  </div>
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

const ThreadDetail = () => {
  const { id } = useParams();
  const thread = {
    id,
    title: `Thread ${id}`,
    description: `Descrição da thread ${id}`,
  };

  return (
    <div className="thread-detail">
      <h2>{thread.userName}</h2>
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
    </div>
  );
};

const NewThreadForm = ({ onCreateThread, user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const apiURL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se os campos obrigatórios estão preenchidos
    if (!title || !description) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const userId = user.data.id;
    const response = await fetch(`${apiURL}/thread/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, user_id: userId }),
    });

    if (response.ok) {
      onCreateThread({ title, description, user_id: userId });
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
        <button onClick={() => window.location.reload()} type="submit">
          Criar Thread
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("User:", storedUser);
      setUser(JSON.parse(storedUser));
    }
    getThreads();
    console.log(user);
  }, []);

  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

    setThreads(threadData.data);
    console.log(threadData.data);
  };

  const handleCreateThread = (newThread) => {
    setThreads([...threads, { id: threads.length + 1, ...newThread }]);
    setShowForm(false);
  };

  return (
    <div className="app">
      {user && user.data && user.data.id && (
        <div className="create-thread-container">
          <button onClick={() => setShowForm(true)}>Criar uma discussão</button>
        </div>
      )}
      {showForm && (
        <NewThreadForm onCreateThread={handleCreateThread} user={user} />
      )}
      <ThreadList threads={threads} user={user} />
    </div>
  );
};

export default App;
