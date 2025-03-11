import React, { useState, useEffect } from 'react';
import { Button } from '@strapi/design-system';

interface GenerateUuidButtonProps {
  onUuidGenerated: (uuid: string) => void;
  onReset?: (resetFn: () => void) => void;
  isDisabled?: boolean;
  setNotification?: (
    notification: { message: string; variant: 'success' | 'danger' } | null
  ) => void; // Додаємо опціональний пропс для сповіщень
}

const GenerateUuidButton: React.FC<GenerateUuidButtonProps> = ({
  onUuidGenerated,
  onReset,
  isDisabled = false,
  setNotification, // Додаємо можливість передати функцію для сповіщень
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/certificate-generator/generate-uuid', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '')}`,
        },
      });

      // Перевіряємо, чи успішна відповідь
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Не авторизовано. Увійдіть у систему.');
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Помилка при генерації UUID');
        }
      }

      const data = await res.json();
      if (!data.uuid) {
        throw new Error('UUID не отримано від сервера');
      }

      onUuidGenerated(data.uuid);
      setIsGenerated(true);

      // Якщо є функція сповіщення, показуємо успіх
      if (setNotification) {
        setNotification({
          message: 'UUID успішно згенеровано',
          variant: 'success',
        });
      }
    } catch (error: any) {
      console.error('Error generating UUID:', error);

      // Якщо є функція сповіщення, показуємо помилку
      if (setNotification) {
        setNotification({
          message: error.message || 'Невідома помилка при генерації UUID',
          variant: 'danger',
        });
      }
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
