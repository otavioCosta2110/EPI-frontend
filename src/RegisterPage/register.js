import React, { useState } from 'react';
import './register.css'; 

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const apiURL = 'http://localhost:3000';

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
                    role: role === 'admin' ? 0 : 1,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar dados');
            }

            //window.location.href = "/login";
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
                Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="usuario">Usuário</option>
                </select>
            </label>
            <input type="submit" value="Registrar" onClick={handleSubmit} />
        </form>
    );
}

export default Register;
