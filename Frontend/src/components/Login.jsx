import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assurez-vous d'avoir ce hook
import '../styles/Login.css'; // Assurez-vous d'avoir ce fichier CSS

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Hook personnalisé pour gérer l'authentification

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            if (response.data) {
                // Mettre à jour le contexte d'authentification
                login({
                    userId: response.data.userId,
                    role: response.data.role,
                    nom: response.data.nom,
                    prenom: response.data.prenom
                });

                // Stocker le token et le nom d'utilisateur dans le localStorage
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userName', response.data.nom || formData.email.split('@')[0]);

                setSuccess('Connexion réussie !');
                setFormData({ email: '', motDePasse: '' });

                // Rediriger selon le rôle
                setTimeout(() => {
                    if (response.data.role === 'ENSEIGNANT') {
                        navigate('/td');
                    } else {
                        navigate('/quiz');
                    }
                }, 1000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Bienvenue</h2>
            <p>Connectez-vous à votre compte</p>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="motDePasse"
                    placeholder="Mot de passe"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
};

export default Login;