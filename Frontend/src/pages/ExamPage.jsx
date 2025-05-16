import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import axios from 'axios';
import '../styles/Exam.css'; // Assurez-vous d'avoir ce fichier CSS
import PDFDownloadButton from '../components/generatePdf';


const ExamPage = () => {
    const [exam, setExam] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSuccess = async (extractedText) => {
        try {
            setIsLoading(true);
            setError(null);

            const examRequest = {
                content: typeof extractedText === 'object' ? extractedText.text : extractedText,
                title: "Examen à générer",
                createdAt: new Date()
            };

            const response = await axios.post('http://localhost:8080/api/exams/generate', examRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setExam(response.data);
        } catch (err) {
            console.error("Erreur détaillée:", err.response?.data);
            setError(err.response?.data || "Erreur lors de la génération de l'examen");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="exam-page">
            <h1>Générateur d'Examens</h1>

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
                    Génération de l'examen en cours...
                </div>
            )}

            {error && (
                <div className="status-message error">
                    {error}
                </div>
            )}

            {exam && (
    <>
        <div className="generated-content">
            <h2>{exam.title}</h2>
            <div className="content">
                {exam.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>
        <PDFDownloadButton
            title={exam.title}
            content={exam.content}
        />
    </>
)}
        </div>
    );
};

export default ExamPage;