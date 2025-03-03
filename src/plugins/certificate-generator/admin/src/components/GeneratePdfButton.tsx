import React, { useState } from 'react';
import { Button, Typography } from '@strapi/design-system';

interface GeneratePdfButtonProps {
  id: string;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({ id }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    const res = await fetch(`/certificate-generator/generate-pdf/${id}`, { method: 'POST' });
    const data = await res.json();
    setPdfUrl(data.pdfPath);
  };

  return (
    <>
      <Button onClick={handleGenerate}>Generate PDF</Button>
      {pdfUrl && <Typography>PDF: {pdfUrl}</Typography>}
    </>
  );
};

export default GeneratePdfButton;
