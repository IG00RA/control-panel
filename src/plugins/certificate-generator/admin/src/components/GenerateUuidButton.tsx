import React, { useState, useEffect } from 'react';
import { Button } from '@strapi/design-system';

interface GenerateUuidButtonProps {
  onUuidGenerated: (uuid: string) => void;
  onReset?: (resetFn: () => void) => void;
  isDisabled?: boolean;
}

const GenerateUuidButton: React.FC<GenerateUuidButtonProps> = ({
  onUuidGenerated,
  onReset,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/certificate-generator/generate-uuid');
      const data = await res.json();
      onUuidGenerated(data.uuid);
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating UUID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setIsGenerated(false);
  };

  useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, [onReset]);

  return (
    <Button onClick={handleClick} disabled={isLoading || isGenerated || isDisabled}>
      {isLoading ? 'Генерація...' : isGenerated ? 'UUID згенеровано' : 'Згенерувати UUID'}
    </Button>
  );
};

export default GenerateUuidButton;
