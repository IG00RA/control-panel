import React, { useState } from 'react';
import { Button, Typography } from '@strapi/design-system';

interface GeneratePdfButtonProps {
  certificateData: {
    uuid: string | null;
    fullName: string;
    streamNumber: number | null;
    startDate: Date | null;
    endDate: Date | null;
    tariff: string | null;
    telegramId: string;
    grades: any;
    qrCode: string | null;
    averageGradePoints: number | null;
    averageGradePercentages: number | null;
    recommendationsMentor: string;
    recommendationsCurator: string;
    videoReview: string;
    caseLink: string;
    pdfUrl: string | null;
  };
  onPdfGenerated?: (pdfUrl: string) => void;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  certificateData,
  onPdfGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!certificateData.uuid) {
      console.error('UUID is required to generate PDF');
      return;
    }
    const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : null);

    // У GeneratePdfButton перед fetch:
    const formattedData = {
      ...certificateData,
      startDate: formatDate(certificateData.startDate),
      endDate: formatDate(certificateData.endDate),
    };

    setIsLoading(true);
    try {
      const res = await fetch(`/certificate-generator/generate-pdf/${formattedData.uuid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      const data = await res.json();
      setIsGenerated(true);
      if (onPdfGenerated) {
        onPdfGenerated(data.pdfPath);
      }
    } catch (error) {
      setIsGenerated(false);
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={isLoading || isGenerated || !certificateData.uuid}>
        {isLoading ? 'Generating...' : isGenerated ? 'PDF Generated' : 'Generate PDF'}
      </Button>
    </>
  );
};

export default GeneratePdfButton;
