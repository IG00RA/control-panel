import React, { useState, useEffect } from 'react';
import { Button } from '@strapi/design-system';
import { CertificateData } from 'src/pages/HomePage';
import { toast } from 'react-toastify';

interface GeneratePdfButtonProps {
  certificateData: CertificateData;
  onPdfGenerated: (pdfUrl: string) => void;
  onReset?: (resetFn: () => void) => void;
  initialIsGenerated?: boolean;
  setNotification: (
    notification: { message: string; variant: 'success' | 'danger' } | null
  ) => void;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  certificateData,
  onPdfGenerated,
  onReset,
  initialIsGenerated = false,
  setNotification,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(initialIsGenerated);
  const [certificateId, setCertificateId] = useState<string | null>(
    certificateData.certificateId || null
  );

  const resetState = () => {
    setIsLoading(false);
    setIsGenerated(false);
    setCertificateId(null);
  };

  const validateFields = () => {
    const requiredFields = {
      uuid: certificateData.uuid,
      fullName: certificateData.fullName,
      streamNumber: certificateData.streamNumber,
      startDate: certificateData.startDate,
      endDate: certificateData.endDate,
      tariff: certificateData.tariff,
      telegramId: certificateData.telegramId,
      grades: certificateData.grades,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setNotification({
        message: `Заповніть обов’язкові поля: ${missingFields.join(', ')}`,
        variant: 'danger',
      });
      return false;
    }
    return true;
  };

  const handleGeneratePdf = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      if (!isGenerated) {
        const response = await fetch('/certificate-generator/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '')}`,
          },
          body: JSON.stringify(certificateData),
        });
        const responseData = await response.json();

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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '')}`,
          },
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
      setNotification({ message: error.message, variant: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, [onReset]);

  useEffect(() => {
    if (certificateData.certificateId) {
      setCertificateId(certificateData.certificateId);
      setIsGenerated(true);
    }
  }, [certificateData.certificateId]);

  return (
    <Button onClick={handleGeneratePdf} disabled={isLoading}>
      {isLoading ? 'Обробка...' : isGenerated ? 'Оновити PDF' : 'Згенерувати PDF'}
    </Button>
  );
};

export default GeneratePdfButton;
