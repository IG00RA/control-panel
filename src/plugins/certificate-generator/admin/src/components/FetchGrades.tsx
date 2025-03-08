import React, { useState } from 'react';
import { TextInput, Button } from '@strapi/design-system';

interface FetchGradesProps {
  onGradesFetched: (grades: any) => void;
  onTelegramIdChange: (telegramId: string) => void; // Новий пропс для оновлення telegramId
  onReset?: (resetFn: () => void) => void;
}

const FetchGrades: React.FC<FetchGradesProps> = ({
  onGradesFetched,
  onTelegramIdChange,
  onReset,
}) => {
  const [telegramId, setTelegramId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setTelegramId('');
    setIsLoading(false);
  };

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/certificate-generator/fetch-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId }),
      });
      const data = await res.json();
      onGradesFetched(data); // Передаємо оцінки в головний компонент
      onTelegramIdChange(telegramId); // Передаємо telegramId для оновлення стейту
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, [onReset]);

  return (
    <>
      <TextInput
        label="Telegram ID"
        value={telegramId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegramId(e.target.value)}
      />
      <Button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Отримати оцінки'}
      </Button>
    </>
  );
};

export default FetchGrades;
