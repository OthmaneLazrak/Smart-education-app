// src/components/PDFDownloadButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

const PDFDownloadButton = ({ title, content }) => {
    const handleDownloadPDF = () => {
        if (!content) return;

        const doc = new jsPDF();
        const splitTitle = doc.splitTextToSize(title, 180);
        const splitContent = doc.splitTextToSize(content, 180);

        doc.setFontSize(16);
        doc.text(splitTitle, 15, 20);

        doc.setFontSize(12);
        doc.text(splitContent, 15, 40);

        doc.save(`${title}.pdf`);
    };

    return (
        <div className="download-section">
            <button
                className="download-button"
                onClick={handleDownloadPDF}
            >
                <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px' }} />
                Télécharger en PDF
            </button>
        </div>
    );
};

export default PDFDownloadButton;