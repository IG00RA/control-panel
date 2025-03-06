import React from 'react';
import { Button } from '@strapi/design-system';
import { CertificateData } from 'src/pages/HomePage';

interface GeneratePdfButtonProps {
  certificateData: CertificateData;
  onPdfGenerated: (pdfUrl: string) => void;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  certificateData,
  onPdfGenerated,
}) => {
  const handleGeneratePdf = async () => {
    try {
      const response = await fetch('/certificate-generator/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');
      const { pdfUrl } = await response.json();

      // Зберігаємо дані в базі через ендпоінт create
      const formattedData = {
        ...certificateData,
        startDate: certificateData.startDate?.toISOString().split('T')[0] || null,
        endDate: certificateData.endDate?.toISOString().split('T')[0] || null,
        pdfPath: pdfUrl,
      };

      const createResponse = await fetch('/certificate-generator/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formattedData }),
      });

      if (!createResponse.ok) throw new Error('Failed to save certificate data');
      await createResponse.json();

      onPdfGenerated(pdfUrl);
    } catch (error) {
      console.error('Error generating or saving PDF:', error);
    }
  };

  return <Button onClick={handleGeneratePdf}>Generate PDF</Button>;
};

export default GeneratePdfButton;
