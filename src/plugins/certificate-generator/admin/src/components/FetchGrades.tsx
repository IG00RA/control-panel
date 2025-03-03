import React, { useState } from 'react';
import { TextInput, Button, Typography } from '@strapi/design-system';

interface FetchGradesProps {
  onGradesFetched: (grades: any) => void;
}

const FetchGrades: React.FC<FetchGradesProps> = ({ onGradesFetched }) => {
  const [telegramId, setTelegramId] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleFetch = async () => {
    const res = await fetch('/certificate-generator/fetch-grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId }),
    });
    const data = await res.json();
    setResult(data);
    onGradesFetched(data);
  };

  return (
    <>
      <TextInput
        label="Telegram ID"
        value={telegramId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegramId(e.target.value)}
      />
      <Button onClick={handleFetch}>Fetch Grades</Button>
      {result && <Typography>{JSON.stringify(result)}</Typography>}
    </>
  );
};

export default FetchGrades;
