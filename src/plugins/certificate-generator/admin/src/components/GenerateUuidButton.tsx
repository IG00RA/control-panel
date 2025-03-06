import React, { useState } from 'react';
import { Button } from '@strapi/design-system';

interface GenerateUuidButtonProps {
  onUuidGenerated: (uuid: string) => void;
  onReset?: (resetFn: () => void) => void; // Додаємо пропс для скидання
}

const GenerateUuidButton: React.FC<GenerateUuidButtonProps> = ({ onUuidGenerated, onReset }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/certificate-generator/generate-uuid');
      const data = await res.json();
      onUuidGenerated(data.uuid);
      setIsGenerated(true); // Вимикаємо кнопку після успішної генерації
    } catch (error) {
      console.error('Error generating UUID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для скидання стану
  const resetState = () => {
    setIsLoading(false);
    setIsGenerated(false);
  };

  // Передаємо функцію скидання через onReset
  React.useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, [onReset]);

  return (
    <Button onClick={handleClick} disabled={isLoading || isGenerated}>
      {isLoading ? 'Generating...' : isGenerated ? 'UUID Generated' : 'Generate UUID'}
    </Button>
  );
};

export default GenerateUuidButton;
