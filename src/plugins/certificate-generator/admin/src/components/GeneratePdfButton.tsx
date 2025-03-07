import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    setIsLoading(true);
    try {
      if (!isGenerated) {
        // Перша генерація: створюємо PDF і запис у базі
        const response = await fetch('/certificate-generator/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData),
        });

        if (!response.ok) throw new Error('Не вдалося згенерувати PDF');
        const { pdfUrl } = await response.json();

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

        if (!createResponse.ok) throw new Error('Не вдалося зберегти дані сертифіката');
        const createdCertificate = await createResponse.json();
        setCertificateId(createdCertificate.id); // Зберігаємо ID сертифіката
        setIsGenerated(true);
        onPdfGenerated(pdfUrl);
      } else {
        // Регенерація: оновлюємо PDF і дані в базі
        const response = await fetch(`/certificate-generator/update-pdf/${certificateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData),
        });

        if (!response.ok) throw new Error('Не вдалося оновити сертифікат');
        const { pdfUrl } = await response.json();
        onPdfGenerated(pdfUrl);
      }
    } catch (error) {
      console.error('Помилка при генерації або оновленні PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGeneratePdf} disabled={isLoading}>
      {isLoading ? 'Обробка...' : isGenerated ? 'Оновити PDF' : 'Згенерувати PDF'}
    </Button>
  );
};

export default GeneratePdfButton;
