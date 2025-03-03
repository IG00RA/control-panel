import React from 'react';
import { Button } from '@strapi/design-system';

interface GenerateUuidButtonProps {
  onUuidGenerated: (uuid: string) => void;
}

const GenerateUuidButton: React.FC<GenerateUuidButtonProps> = ({ onUuidGenerated }) => {
  const handleClick = async () => {
    const res = await fetch('/certificate-generator/generate-uuid');
    const data = await res.json();
    onUuidGenerated(data.uuid);
  };

  return <Button onClick={handleClick}>Generate UUID</Button>;
};

export default GenerateUuidButton;
