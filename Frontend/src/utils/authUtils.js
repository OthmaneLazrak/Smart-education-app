// src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';  // Changement ici

export const checkTokenValidity = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return {
            isValid: false,
            error: 'Aucun token trouvé'
        };
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return {
                isValid: false,
                error: 'Token expiré'
            };
        }

        return {
            isValid: true,
            role: decoded.role,
            username: decoded.sub
        };
    } catch (error) {
        localStorage.removeItem('token');
        return {
            isValid: false,
            error: 'Token invalide'
        };
    }
};

export const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};