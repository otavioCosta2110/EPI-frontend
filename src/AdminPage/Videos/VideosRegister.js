import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function VideoRegister() {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [adminId, setAdminId] = useState('');
    const [user, setUser] = useState('');

    const apiURL = 'http://localhost:3000';

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagResponse = await fetch(`${apiURL}/tag/gettags`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const tagsData = await tagResponse.json();
                const tagNames = tagsData.data.map(tag => tag.name);
                setTags(tagNames);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);

    useEffect(() => {
        if (user && user.data && user.data.id) {
        setAdminId(user.data.id);
        const AdminId = user.data.id;
        }
      }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiURL}/video/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title,
                url,
                description,
                tags: selectedTags,
                user_id: adminId,
              }),
            });
            if (response.ok) {
                window.location.href = "/adminPage";
            } 
            if (selectedTags.length > 0) {
                tags = selectedTags;
            }
        }catch (error) {
            setError("Erro ao registrar vídeo");
        } 
    };
    
    
    return (
        user && user.data && user.data.role =='0' ? (
            <form onSubmit={handleSubmit}>
                <label>
                    Título:
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    URL do vídeo:
                    <input
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)} />
                </label>
                <label>
                    Descrição:
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    Tags:
                    <Autocomplete
                        multiple
                        id="combo-box-demo"
                        options={tags}
                        className="autocomplete-container"
                        renderInput={(params) => <TextField {...params} className="autocomplete-input" label="Tags" />}
                        onChange={(event, newValue) => {
                            setSelectedTags(newValue);
                        }}
                    />
                </label>
                <input type="submit" value="Registrar Vídeo" />
                {error && <div className="error">{error}</div>}
            </form>
        ) : (
            <div>Você não possui autorização para essa função.</div>
        )
    );
}

export default VideoRegister;
