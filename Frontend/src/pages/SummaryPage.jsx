import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import axios from 'axios';
import '../styles/Summary.css'; // Assurez-vous d'avoir ce fichier CSS
import PDFDownloadButton from '../components/generatePdf';


const SummaryPage = () => {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSuccess = async (extractedText) => {
        try {
            setIsLoading(true);
            setError(null);

            const summaryRequest = {
                content: typeof extractedText === 'object' ? extractedText.text : extractedText,
                title: "Résumé à générer",
                createdAt: new Date()
            };

            const response = await axios.post('http://localhost:8080/api/summaries/generate', summaryRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSummary(response.data);
        } catch (err) {
            console.error("Erreur détaillée:", err.response?.data);
            setError(err.response?.data || "Erreur lors de la génération du résumé");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="summary-page">
            <h1>Générateur de Résumé</h1>
            
            <FileUploader
                onSuccess={handleFileSuccess}
                onError={(msg) => setError(msg)}
                maxSizeMB={10}
                apiBaseUrl="http://localhost:8080"
            />

            {isLoading && (
                <div className="loading">
                    <p>Génération du résumé en cours...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

           {summary && (
    <>
        <div className="summary-result">
            <h2>{summary.title}</h2>
            <div className="summary-content">
                {summary.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>
        <PDFDownloadButton
            title={summary.title}
            content={summary.content}
        />
    </>
)}
        </div>
    );
};

export default SummaryPage;