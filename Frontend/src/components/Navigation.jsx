import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../img/educ-image.png';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo pulse-animation" />
        <h1 className="navbar-title">SMART-EDUCATION</h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav-container ${menuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Accueil</Link></li>
          
          {isAuthenticated && (
            <>
              <li><Link to="/quiz" className="nav-link">Quiz</Link></li>
              <li><Link to="/problem" className="nav-link">Problèmes</Link></li>
              <li><Link to="/summary" className="nav-link">Résumés</Link></li>
              
              {user?.role === 'ENSEIGNANT' && (
                <>
                  <li><Link to="/td" className="nav-link">TD</Link></li>
                  <li><Link to="/exam" className="nav-link">Examens</Link></li>
                </>
              )}
            </>
          )}

          {!isAuthenticated ? (
            <>
              <li><Link to="/login" className="nav-link highlight">Connexion</Link></li>
              <li><Link to="/register" className="nav-link highlight secondary">Inscription</Link></li>
            </>
          ) : (
            <>
              <li><span className="nav-link">Bienvenue, {user.prenom}</span></li>
              <li><button onClick={handleLogout} className="nav-link highlight">Déconnexion</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;