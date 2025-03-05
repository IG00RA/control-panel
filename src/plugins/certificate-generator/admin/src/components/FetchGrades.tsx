import React, { useState } from 'react';
import { TextInput, Button } from '@strapi/design-system';

interface FetchGradesProps {
  onGradesFetched: (grades: any) => void;
}

const FetchGrades: React.FC<FetchGradesProps> = ({ onGradesFetched }) => {
  const [telegramId, setTelegramId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TextInput
        label="Telegram ID"
        value={telegramId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegramId(e.target.value)}
      />
      <Button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Grades'}
      </Button>
    </>
  );
};

export default FetchGrades;
