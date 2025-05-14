import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const FileUploader = ({ 
  onSuccess, 
  onError,
  maxSizeMB = 10,
  apiBaseUrl = 'http://localhost:8080'
}) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState(null); // Stocke le texte extrait (objet ou chaîne)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setExtractedText(null);

        console.log('Fichier sélectionné :', selectedFile); // Log pour déboguer

        if (!selectedFile) {
            setError('Aucun fichier sélectionné');
            return;
        }

        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setError(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
            return;
        }

        console.log('Fichier accepté :', selectedFile); // Log pour confirmer la validation
        setFile(selectedFile);
    };

    const handleExtract = async () => {
        if (!file) {
            setError('Veuillez sélectionner un fichier valide');
            console.log('Aucun fichier à téléverser'); // Log pour déboguer
            return;
        }

        console.log('Téléversement pour extraction :', file); // Log pour confirmer le téléversement
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${apiBaseUrl}/api/uploaded-files/extract`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            });

            console.log('Texte extrait :', response.data); // Log pour vérifier la réponse du backend
            setExtractedText(response.data); // Stocke le texte extrait
            if (onSuccess) {
                onSuccess(response.data);
            }

            setFile(null);
            setProgress(0);
            document.getElementById('file-input').value = ''; // Réinitialise l'input
        } catch (err) {
            const errorMsg = err.response?.data || 
                           err.message || 
                           'Échec de l\'extraction';
            console.error('Erreur lors de l\'extraction :', errorMsg); // Log pour déboguer
            setError(errorMsg);

            if (onError) {
                onError(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="file-uploader-container" style={{ 
            margin: '20px 0',
            padding: '20px',
            border: '1px dashed #ccc',
            borderRadius: '5px'
        }}>
            <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept="" // Autorise tous les types de fichiers
                disabled={isLoading}
                aria-label="Sélectionner un fichier à téléverser"
                style={{ display: 'block', margin: '10px 0' }}
            />

            {file && (
                <div style={{ margin: '10px 0' }}>
                    <p>Fichier sélectionné: {file.name}</p>
                    <p>Taille: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}

            {isLoading && (
                <div style={{ width: '100%', backgroundColor: '#f1f1f1', margin: '10px 0' }}>
                    <div 
                        style={{ 
                            width: `${progress}%`,
                            height: '20px',
                            backgroundColor: progress === 100 ? '#4CAF50' : '#2196F3',
                            textAlign: 'center',
                            lineHeight: '20px',
                            color: 'white'
                        }}
                    >
                        {progress}%
                    </div>
                </div>
            )}

            <button
                onClick={handleExtract}
                disabled={!file || isLoading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: !file || isLoading ? '#cccccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: !file || isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                }}
                aria-disabled={!file || isLoading}
            >
                {isLoading ? 'Extraction en cours...' : 'Extraire le contenu'}
            </button>

            {error && (
                <p style={{ 
                    color: '#d32f2f', 
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px'
                }}>
                    {error}
                </p>
            )}

            {extractedText && (
                <div style={{ 
                    marginTop: '20px', 
                    padding: '10px', 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: '4px' 
                }}>
                    <h3>Texte extrait :</h3>
                    {typeof extractedText === 'object' ? (
                        <>
                            <p><strong>Nom du fichier :</strong> {extractedText.filename}</p>
                            <p><strong>Type MIME :</strong> {extractedText.mime_type}</p>
                            <p><strong>Statut :</strong> {extractedText.status}</p>
                            <p><strong>Texte :</strong> {extractedText.text}</p>
                        </>
                    ) : (
                        <p>{extractedText}</p>
                    )}
                </div>
            )}
        </div>
    );
};

FileUploader.propTypes = {
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    maxSizeMB: PropTypes.number,
    apiBaseUrl: PropTypes.string
};

export default FileUploader;