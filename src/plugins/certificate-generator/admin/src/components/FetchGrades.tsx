import React, { useState, useEffect } from 'react';
import { TextInput, Button } from '@strapi/design-system';

interface FetchGradesProps {
  onGradesFetched: (grades: any) => void;
  onTelegramIdChange: (telegramId: string) => void;
  onReset?: (resetFn: () => void) => void;
  initialTelegramId?: string; // Додаємо пропс для початкового значення
}

const FetchGrades: React.FC<FetchGradesProps> = ({
  onGradesFetched,
  onTelegramIdChange,
  onReset,
  initialTelegramId = '', // Значення за замовчуванням - порожній рядок
}) => {
  const [telegramId, setTelegramId] = useState(initialTelegramId);
  const [isLoading, setIsLoading] = useState(false);

  // Оновлюємо telegramId, якщо initialTelegramId змінюється
  useEffect(() => {
    setTelegramId(initialTelegramId);
  }, [initialTelegramId]);

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
      onGradesFetched(data);
      onTelegramIdChange(telegramId);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
