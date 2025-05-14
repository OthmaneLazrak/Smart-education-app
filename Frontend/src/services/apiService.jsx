import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Changez cette URL si votre API est hébergée ailleurs

export const uploadFile = async (file, choice) => {
    // Liste des choix autorisés
    const validChoices = ['uploaded-files/upload', 'quizes/generate', 'problems/generate'];

    if (!validChoices.includes(choice)) {
        throw new Error(`Choix invalide : ${choice}`);
    }

    // Validation du fichier
    if (!file) {
        throw new Error("Le fichier est requis et ne peut pas être vide.");
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/api/${encodeURIComponent(choice)}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'upload du fichier :', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Une erreur est survenue lors de l'upload du fichier.");
    }
};