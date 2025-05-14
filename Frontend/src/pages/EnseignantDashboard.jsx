import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaClipboardList, FaPencilAlt, FaQuestionCircle, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const EnseignantDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Tableau de Bord Enseignant</h1>
                <div className="user-info">
                    <span className="user-name">
                        <FaUserGraduate className="icon" />
                        {user?.prenom} {user?.nom}
                    </span>
                </div>
            </header>

            <div className="stats-overview">
                <h2>Mes Ressources Pédagogiques</h2>
                <div className="dashboard-grid">
                    <Link to="/td" className="dashboard-card">
                        <FaChalkboardTeacher className="card-icon" />
                        <div className="card-content">
                            <h3>Travaux Dirigés</h3>
                            <p>Créer et gérer les TD</p>
                        </div>
                    </Link>

                    <Link to="/exam" className="dashboard-card">
                        <FaPencilAlt className="card-icon" />
                        <div className="card-content">
                            <h3>Examens</h3>
                            <p>Créer et gérer les examens</p>
                        </div>
                    </Link>

                    <Link to="/quiz" className="dashboard-card">
                        <FaQuestionCircle className="card-icon" />
                        <div className="card-content">
                            <h3>Quiz</h3>
                            <p>Créer et gérer les quiz</p>
                        </div>
                    </Link>

                    <Link to="/problem" className="dashboard-card">
                        <FaClipboardList className="card-icon" />
                        <div className="card-content">
                            <h3>Problèmes</h3>
                            <p>Créer et gérer les problèmes</p>
                        </div>
                    </Link>

                    <Link to="/summary" className="dashboard-card">
                        <FaBook className="card-icon" />
                        <div className="card-content">
                            <h3>Résumés</h3>
                            <p>Créer et gérer les résumés</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EnseignantDashboard;