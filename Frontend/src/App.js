import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import QuizPage from './pages/QuizPage';
import SummaryPage from './pages/SummaryPage';
import ProblemPage from './pages/ProblemPage';
import TDPage from './pages/TDPage';
import ExamPage from './pages/ExamPage';
import EnseignantDashboard from './pages/EnseignantDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navigation />

          <main className="main-content">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Routes protégées accessibles aux deux rôles */}
              <Route path="/quiz" element={
                <ProtectedRoute allowedRoles={['ETUDIANT', 'ENSEIGNANT']}>
                  <QuizPage />
                </ProtectedRoute>
              } />
              <Route path="/problem" element={
                <ProtectedRoute allowedRoles={['ETUDIANT', 'ENSEIGNANT']}>
                  <ProblemPage />
                </ProtectedRoute>
              } />
              <Route path="/summary" element={
                <ProtectedRoute allowedRoles={['ETUDIANT', 'ENSEIGNANT']}>
                  <SummaryPage />
                </ProtectedRoute>
              } />

              {/* Routes accessibles uniquement aux enseignants */}
              <Route path="/enseignant/dashboard" element={
                <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
                  <EnseignantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/td" element={
                <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
                  <TDPage />
                </ProtectedRoute>
              } />
              <Route path="/exam" element={
                <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
                  <ExamPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          <footer className="footer">
            <div className="footer-content">
              <p>&copy; 2025 Smart Edu App. Tous droits réservés.</p>
              <div className="footer-links">
                <Link to="/about">À propos</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/privacy">Confidentialité</Link>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;