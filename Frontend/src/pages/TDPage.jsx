import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import axios from 'axios';

const TDPage = () => {
    const [td, setTd] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSuccess = async (extractedText) => {
        try {
            setIsLoading(true);
            setError(null);

            const tdRequest = {
                content: typeof extractedText === 'object' ? extractedText.text : extractedText,
                title: "TD à générer",
                createdAt: new Date()
            };

            const response = await axios.post('http://localhost:8080/api/tds/generate', tdRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setTd(response.data);
        } catch (err) {
            console.error("Erreur détaillée:", err.response?.data);
            setError(err.response?.data || "Erreur lors de la génération du TD");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="td-page">
            <h1>Générateur de TD</h1>
            
            <div className="upload-section">
                <FileUploader
                    onSuccess={handleFileSuccess}
                    onError={(msg) => setError(msg)}
                    maxSizeMB={10}
                    apiBaseUrl="http://localhost:8080"
                />
            </div>

            {isLoading && (
                <div className="status-message loading">
                    <div className="loading-spinner"></div>
                    Génération du TD en cours...
                </div>
            )}

            {error && (
                <div className="status-message error">
                    {error}
                </div>
            )}

            {td && (
                <div className="generated-content">
                    <h2>{td.title}</h2>
                    <div className="content">
                        {td.content.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TDPage;