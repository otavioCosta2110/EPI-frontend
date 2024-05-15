import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import './register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = {
                name,
                email,
                password,
                role: '0', 
            };
            if (selectedTags.length > 0) {
                body.tags = selectedTags;
            }

            const response = await fetch(`${apiURL}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                window.location.href = "/login";
            } else {
                setError('Erro ao enviar dados');
            }
        } catch (error) {
            setError('Erro ao enviar dados');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome:
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                E-mail:
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Senha:
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Preferência:
                <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={tags}
                    className="autocomplete-container"
                    renderInput={(params) => <TextField {...params} className="autocomplete-input" label="Preferência" />}
                    onChange={(event, newValue) => {
                        setSelectedTags(newValue);
                    }}
                />
            </label>
            <input type="submit" value="Registrar" />
            {error && <p>{error}</p>}
        </form>
    );
}

export default Register;
