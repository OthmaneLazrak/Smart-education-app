import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import '../styles/Form.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Simuler un chargement pour l'animation
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        // Récupérer le nom d'utilisateur du localStorage s'il existe
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="homepage-container">
            {loading ? (
                <div className="loading-screen">
                    <div className="loader"></div>
                    <p>Chargement de votre environnement d'apprentissage...</p>
                </div>
            ) : (
                <>
                    <header className="header">
                        <div className="header-content">
                            <h1 className="animated-title">
                                <span className="title-part">Smart</span>
                                <span className="title-part highlight">Education</span>
                            </h1>
                            {userName && (
                                <div className="welcome-message">
                                    <p>Bonjour, <span className="user-name">{userName}</span> !</p>
                                </div>
                            )}
                            <p className="header-subtitle">Apprenez intelligemment, progressez efficacement</p>
                        </div>

                        <div className="header-illustration">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                    </header>

                    <main className="main-content">
                        <Dashboard />
                    </main>

                    <section className="features-section">
                        <h2>Pourquoi choisir Smart Education ?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">🎯</div>
                                <h3>Apprentissage Personnalisé</h3>
                                <p>Contenu adapté à votre rythme et à vos besoins</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🔄</div>
                                <h3>Progression Continue</h3>
                                <p>Suivez votre évolution et améliorez vos compétences</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🏆</div>
                                <h3>Récompenses</h3>
                                <p>Gagnez des badges et des points en progressant</p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default HomePage;