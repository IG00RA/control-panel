import React, { useState, useEffect } from 'react';
import { TextInput, Button } from '@strapi/design-system';

interface FetchGradesProps {
  onGradesFetched: (grades: any) => void;
  onTelegramIdChange: (telegramId: string) => void;
  onReset?: (resetFn: () => void) => void;
  initialTelegramId?: string;
  setNotification?: (
    notification: { message: string; variant: 'success' | 'danger' } | null
  ) => void;
}

const FetchGrades: React.FC<FetchGradesProps> = ({
  onGradesFetched,
  onTelegramIdChange,
  onReset,
  initialTelegramId = '',
  setNotification,
}) => {
  const [telegramId, setTelegramId] = useState(initialTelegramId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTelegramId(initialTelegramId);
  }, [initialTelegramId]);

  const resetState = () => {
    setTelegramId('');
    setIsLoading(false);
  };

  const handleFetch = async () => {
    if (!telegramId) {
      if (setNotification) {
        setNotification({
          message: 'Введіть Telegram ID',
          variant: 'danger',
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      }

      const token = localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '')
        ? localStorage.getItem('jwtToken')?.replace(/['"]+/g, '')
        : getCookie('access_token');

      const res = await fetch('/certificate-generator/fetch-grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telegramId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Не авторизовано. Увійдіть у систему.');
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Помилка при отриманні оцінок');
        }
      }

      const data = await res.json();
      if (!data) {
        throw new Error('Оцінки не отримано від сервера');
      }

      onGradesFetched(data);
      onTelegramIdChange(telegramId);

      // Якщо є функція сповіщення, показуємо успіх
      if (setNotification) {
        setNotification({
          message: 'Оцінки успішно отримано',
          variant: 'success',
        });
      }
    } catch (error: any) {
      console.error('Error fetching grades:', error);

      // Якщо є функція сповіщення, показуємо помилку
      if (setNotification) {
        setNotification({
          message: error.message || 'Невідома помилка при отриманні оцінок',
          variant: 'danger',
        });
      }
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
        {isLoading ? 'Завантаження...' : 'Отримати оцінки'}
      </Button>
    </>
  );
};

export default FetchGrades;
