import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Dashboard = () => {
    const [activeCard, setActiveCard] = React.useState(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Cartes communes aux deux rôles
    const commonCards = [
        {
            id: 'quiz',
            title: 'Quiz Interactifs',
            description: 'Testez vos connaissances avec nos quiz personnalisés',
            icon: '📝',
            color: '#4CAF50'
        },
        {
            id: 'problem',
            title: 'Résolution de Problèmes',
            description: 'Améliorez votre logique avec des problèmes pratiques',
            icon: '🧩',
            color: '#2196F3'
        },
        {
            id: 'summary',
            title: 'Résumés',
            description: 'Accédez aux résumés et synthèses',
            icon: '📚',
            color: '#FF9800'
        }
    ];

    // Cartes spécifiques aux enseignants
    const teacherCards = [
        {
            id: 'td',
            title: 'Travaux Dirigés',
            description: 'Créez et gérez les TD pour vos étudiants',
            icon: '👨‍🏫',
            color: '#9C27B0'
        },
        {
            id: 'exam',
            title: 'Examens',
            description: 'Préparez et organisez les examens',
            icon: '✍️',
            color: '#E91E63'
        }
    ];

    // Sélection des cartes selon le rôle
    const cards = isAuthenticated && user?.role === 'ENSEIGNANT' 
        ? [...commonCards, ...teacherCards] 
        : commonCards;

    const handleCardClick = (path) => {
        if (isAuthenticated) {
            navigate(`/${path}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">
                {isAuthenticated 
                    ? `Bienvenue, ${user.prenom} ${user.nom}` 
                    : 'Apprenez à votre rythme'}
            </h1>
            <p className="dashboard-subtitle">
                {isAuthenticated 
                    ? user.role === 'ENSEIGNANT'
                        ? 'Gérez vos ressources pédagogiques'
                        : 'Sélectionnez une activité pour commencer'
                    : 'Sélectionnez une activité pour commencer votre parcours dapprentissage'}
            </p>

            <div className="cards-container">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`dashboard-card ${activeCard === card.id ? 'active' : ''}`}
                        style={{
                            borderTop: `4px solid ${card.color}`,
                            boxShadow: activeCard === card.id 
                                ? `0 8px 16px rgba(0,0,0,0.2), 0 0 0 2px ${card.color}`
                                : '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => handleCardClick(card.id)}
                        onMouseEnter={() => setActiveCard(card.id)}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        <div className="card-icon" style={{backgroundColor: card.color}}>
                            <span>{card.icon}</span>
                        </div>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                        <div className="card-footer">
                            <button className="card-button" style={{backgroundColor: card.color}}>
                                {isAuthenticated ? 'Accéder' : 'Commencer'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!isAuthenticated && (
                <div className="auth-prompt">
                    <p>Connectez-vous pour sauvegarder votre progression</p>
                    <div className="auth-buttons">
                        <button className="auth-button login" onClick={() => navigate('/login')}>
                            Connexion
                        </button>
                        <button className="auth-button register" onClick={() => navigate('/register')}>
                            Inscription
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;