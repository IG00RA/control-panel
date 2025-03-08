import React, { useState, useEffect } from 'react';
import { Button, Alert } from '@strapi/design-system';
import { CertificateData } from 'src/pages/HomePage';

interface GeneratePdfButtonProps {
  certificateData: CertificateData;
  onPdfGenerated: (pdfUrl: string) => void;
  onReset?: (resetFn: () => void) => void;
  initialIsGenerated?: boolean; // Додаємо пропс для початкового стану
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  certificateData,
  onPdfGenerated,
  onReset,
  initialIsGenerated = false, // Значення за замовчуванням false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(initialIsGenerated); // Використовуємо initialIsGenerated
  const [certificateId, setCertificateId] = useState<string | null>(
    certificateData.certificateId || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetState = () => {
    setIsLoading(false);
    setIsGenerated(false);
    setCertificateId(null);
    setErrorMessage(null);
  };

  const handleGeneratePdf = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (!isGenerated) {
        const response = await fetch('/certificate-generator/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData),
        });
        const responseData = await response.json();
        console.log('Response:', responseData);

        if (!response.ok || responseData.error) {
          const errorMsg = responseData.error?.message || 'Не вдалося згенерувати PDF';
          throw new Error(errorMsg);
        }

        const { pdfUrl, certificateId } = responseData;
        setCertificateId(certificateId);
        setIsGenerated(true);
        onPdfGenerated(pdfUrl);
      } else {
        const response = await fetch(`/certificate-generator/update-pdf/${certificateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData),
        });

        const responseData = await response.json();
        if (!response.ok || responseData.error) {
          const errorMsg = responseData.error?.message || 'Не вдалося оновити сертифікат';
          throw new Error(errorMsg);
        }

        const { pdfUrl } = responseData;
        onPdfGenerated(pdfUrl);
      }
    } catch (error: any) {
      console.error('Помилка при генерації або оновленні PDF:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, [onReset]);

  // Оновлюємо certificateId, якщо він змінюється у certificateData
  useEffect(() => {
    if (certificateData.certificateId) {
      setCertificateId(certificateData.certificateId);
      setIsGenerated(true); // Встановлюємо isGenerated у true, якщо certificateId є
    }
  }, [certificateData.certificateId]);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button onClick={handleGeneratePdf} disabled={isLoading}>
        {isLoading ? 'Обробка...' : isGenerated ? 'Оновити PDF' : 'Згенерувати PDF'}
      </Button>
      {errorMessage && (
        <Alert
          onClose={() => setErrorMessage(null)}
          title="Помилка"
          variant="danger"
          style={{ marginTop: '10px' }}
        >
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

export default GeneratePdfButton;
