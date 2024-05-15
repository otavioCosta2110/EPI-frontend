import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, selectClasses } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import './register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
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
            const response = await fetch(`${apiURL}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role : '1', 
                    tags : selectedTags
                }),
            });
            window.location.href = "/login";
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
                <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={tags}
                    className="autocomplete-container"
                    renderInput={(params) => <TextField {...params} className="autocomplete-input" label="Preferência" />}
                    onChange={(event, newValue) => {
                        setSelectedTags(newValue);
                        console.log(selectedTags);
                    }}
                />
            </label>
            <input type="submit" value="Registrar" onClick={handleSubmit} />
        </form>
    );
}

export default Register;
